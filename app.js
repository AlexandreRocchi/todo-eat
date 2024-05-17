const request = indexedDB.open('ShoppingListDB', 2);

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('items')) {
        const objectStore = db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('name', 'name', { unique: false });
    }
    
    if (!db.objectStoreNames.contains('template_items')) {
        const templateObjectStore = db.createObjectStore('template_items', { keyPath: 'id', autoIncrement: true });
        templateObjectStore.createIndex('name', 'name', { unique: false });
        templateObjectStore.createIndex('template_name', 'template_name', { unique: false });
    }
};

request.onsuccess = (event) => {
    const db = event.target.result;
    console.log('Base de données ouverte avec succès');
    
    if (document.getElementById('item-form')) {
        afficherItems(db);

        document.getElementById('item-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const itemName = document.getElementById('item-name').value;
            const itemQuantity = parseInt(document.getElementById('item-quantity').value, 10);
            const itemUnit = document.getElementById('item-unit').value;
            const itemWeek = getCurrentWeek();
            ajouterOuMettreAJourItem(db, itemName, itemQuantity, itemUnit, itemWeek);
        });

        document.getElementById('save-template').addEventListener('click', () => {
            const templateName = prompt("Entrez le nom du template :");
            if (templateName) {
                addTemplate(db, templateName);
            }
        });
    }

    if (document.getElementById('template-list')) {
        displayTemplates(db);
    }

    if (document.getElementById('import-data')) {
        document.getElementById('import-data').addEventListener('click', () => {
            document.getElementById('file-input').click();
        });

        document.getElementById('file-input').addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        importerDonnees(db, data);
                    } catch (error) {
                        console.error('Erreur lors de la lecture du fichier:', error);
                    }
                };
                reader.readAsText(file);
            }
        });

        document.getElementById('export-data').addEventListener('click', () => {
            exporterDonnees(db);
        });

        document.getElementById('delete-data').addEventListener('click', () => {
            supprimerToutesLesDonnees(db);
        });
    }
};

request.onerror = (event) => {
    console.error('Erreur lors de l\'ouverture de la base de données:', event.target.errorCode);
};

function ajouterOuMettreAJourItem(db, name, quantity, unit, week) {
    const transaction = db.transaction(['items'], 'readwrite');
    const objectStore = transaction.objectStore('items');
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
        const items = event.target.result;
        let itemFound = false;

        items.forEach(item => {
            if (item.name === name && item.unit === unit && item.week === week) {
                item.quantity += quantity;
                const updateRequest = objectStore.put(item);
                updateRequest.onsuccess = () => {
                    document.getElementById('item-form').reset();
                    afficherItems(db);
                };
                updateRequest.onerror = (event) => {
                    console.error('Erreur lors de la mise à jour de l\'élément:', event.target.errorCode);
                };
                itemFound = true;
            }
        });

        if (!itemFound) {
            const addRequest = objectStore.add({ name, quantity, unit, week });
            addRequest.onsuccess = () => {
                document.getElementById('item-form').reset();
                afficherItems(db);
            };
            addRequest.onerror = (event) => {
                console.error('Erreur lors de l\'ajout de l\'élément:', event.target.errorCode);
            };
        }
    };

    request.onerror = (event) => {
        console.error('Erreur lors de la recherche de l\'élément:', event.target.errorCode);
    };
}

function afficherItems(db) {
    const transaction = db.transaction(['items'], 'readonly');
    const objectStore = transaction.objectStore('items');
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
        const items = event.target.result;
        const shoppingList = document.getElementById('shopping-list');
        shoppingList.innerHTML = '';
        const currentWeek = getCurrentWeek();

        // Filtrer les éléments de la semaine en cours
        const filteredItems = items.filter(item => item.week === currentWeek);

        // Afficher les éléments de la semaine en cours
        filteredItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.textContent = `${item.name} - ${item.quantity}${item.unit}`;

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.textContent = 'Supprimer';
            deleteButton.onclick = () => {
                supprimerTousLesItems(db, item.name, item.unit);
            };

            listItem.appendChild(deleteButton);
            shoppingList.appendChild(listItem);
        });
    };

    request.onerror = (event) => {
        console.error('Erreur lors de la récupération des éléments:', event.target.errorCode);
    };
}

function supprimerTousLesItems(db, name, unit) {
    const transaction = db.transaction(['items'], 'readwrite');
    const objectStore = transaction.objectStore('items');
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
        const items = event.target.result;
        const currentWeek = getCurrentWeek();
        const itemsToDelete = items.filter(item => item.name === name && item.unit === unit && item.week === currentWeek);

        itemsToDelete.forEach(item => {
            const deleteRequest = objectStore.delete(item.id);
            deleteRequest.onsuccess = () => {
                console.log(`Élément supprimé : ${item.name} - ${item.quantity}${item.unit}`);
            };
            deleteRequest.onerror = (event) => {
                console.error(`Erreur lors de la suppression de l'élément : ${item.name} - ${item.quantity}${item.unit}`, event.target.errorCode);
            };
        });

        // Réafficher la liste après suppression
        transaction.oncomplete = () => {
            afficherItems(db);
        };
    };

    request.onerror = (event) => {
        console.error('Erreur lors de la récupération des éléments pour suppression:', event.target.errorCode);
    };
}

function importerDonnees(db, data) {
    const transaction = db.transaction(['items', 'template_items'], 'readwrite');
    const itemsStore = transaction.objectStore('items');
    const templateStore = transaction.objectStore('template_items');

    // Traiter les items
    if (data.items && Array.isArray(data.items)) {
        data.items.forEach(item => {
            itemsStore.put(item);
        });
    }

    // Traiter les templates
    if (data.template_items && Array.isArray(data.template_items) && data.template_items.length > 0) {
        data.template_items.forEach(templateItem => {
            templateStore.put(templateItem);
        });
    }

    transaction.oncomplete = () => {
        console.log('Données importées avec succès');
        afficherItems(db);
        displayTemplates(db);
    };

    transaction.onerror = (event) => {
        console.error('Erreur lors de l\'importation des données:', event.target.errorCode);
    };
}

function exporterDonnees(db) {
    const transactionItems = db.transaction(['items'], 'readonly');
    const itemsStore = transactionItems.objectStore('items');
    const requestItems = itemsStore.getAll();

    requestItems.onsuccess = (event) => {
        const items = event.target.result;
        const transactionTemplates = db.transaction(['template_items'], 'readonly');
        const templateStore = transactionTemplates.objectStore('template_items');
        const requestTemplates = templateStore.getAll();

        requestTemplates.onsuccess = (event) => {
            const templates = event.target.result;
            const data = { items, template_items: templates };
            const jsonData = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'shopping_list.json';
            a.click();
            URL.revokeObjectURL(url);
        };

        requestTemplates.onerror = (event) => {
            console.error('Erreur lors de l\'exportation des templates:', event.target.errorCode);
        };
    };

    requestItems.onerror = (event) => {
        console.error('Erreur lors de l\'exportation des items:', event.target.errorCode);
    };
}

function supprimerToutesLesDonnees(db) {
    const transactionItems = db.transaction(['items'], 'readwrite');
    const objectStoreItems = transactionItems.objectStore('items');
    const requestItems = objectStoreItems.clear();

    requestItems.onsuccess = () => {
        console.log('Toutes les données des items ont été supprimées');
    };

    requestItems.onerror = (event) => {
        console.error('Erreur lors de la suppression de toutes les données des items:', event.target.errorCode);
    };

    const transactionTemplates = db.transaction(['template_items'], 'readwrite');
    const objectStoreTemplates = transactionTemplates.objectStore('template_items');
    const requestTemplates = objectStoreTemplates.clear();

    requestTemplates.onsuccess = () => {
        console.log('Toutes les données des templates ont été supprimées');
        afficherItems(db);
        displayTemplates(db);
    };

    requestTemplates.onerror = (event) => {
        console.error('Erreur lors de la suppression de toutes les données des templates:', event.target.errorCode);
    };
}

function getCurrentWeek() {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const weekNumber = Math.ceil((currentDate.getDate() + startOfMonth.getDay()) / 7);
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const monthName = monthNames[currentDate.getMonth()];
    return `Semaine${weekNumber}${monthName}${currentDate.getFullYear()}`;
}

function getPreviousWeek(currentWeek) {
    const regex = /Semaine(\d+)([A-Za-z]+)(\d+)/;
    const match = currentWeek.match(regex);
    if (match) {
        let weekNumber = parseInt(match[1]) - 1;
        const monthName = match[2];
        const year = parseInt(match[3]);

        if (weekNumber < 1) {
            const previousMonth = new Date(year, new Date().getMonth() - 1, 1);
            const previousMonthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
            const previousMonthName = previousMonthNames[previousMonth.getMonth()];
            const lastDayOfPreviousMonth = new Date(year, previousMonth.getMonth() + 1, 0).getDate();
            const startOfPreviousMonth = new Date(year, previousMonth.getMonth(), 1);
            weekNumber = Math.ceil((lastDayOfPreviousMonth + startOfPreviousMonth.getDay()) / 7);
            return `Semaine${weekNumber}${previousMonthName}${year}`;
        }

        return `Semaine${weekNumber}${monthName}${year}`;
    }
    return currentWeek;
}

function addTemplate(db, templateName) {
    const transaction = db.transaction(['template_items'], 'readwrite');
    const templateStore = transaction.objectStore('template_items');
    const request = templateStore.getAll();

    request.onsuccess = (event) => {
        const templates = event.target.result;
        const templateExists = templates.some(template => template.template_name === templateName);

        if (templateExists) {
            alert('Le nom du template existe déjà. Veuillez choisir un autre nom.');
        } else {
            const itemsTransaction = db.transaction(['items'], 'readwrite');
            const itemsStore = itemsTransaction.objectStore('items');
            const itemsRequest = itemsStore.getAll();

            itemsRequest.onsuccess = (event) => {
                const items = event.target.result;
                const currentWeek = getCurrentWeek();

                const templateTransaction = db.transaction(['template_items'], 'readwrite');
                const templateStore = templateTransaction.objectStore('template_items');

                items.forEach(item => {
                    if (item.week === currentWeek) {
                        const newItem = { ...item, template_name: templateName };
                        delete newItem.id;
                        templateStore.add(newItem);
                    }
                });

                templateTransaction.oncomplete = () => {
                    console.log('Template sauvegardé avec succès');
                };
                
                templateTransaction.onerror = (event) => {
                    console.error('Erreur lors de la sauvegarde du template:', event.target.errorCode);
                };
            };

            itemsRequest.onerror = (event) => {
                console.error('Erreur lors de la récupération des éléments actuels:', event.target.errorCode);
            };
        }
    };

    request.onerror = (event) => {
        console.error('Erreur lors de la vérification des templates:', event.target.errorCode);
    };
}

function loadTemplate(db, templateName) {
    const transaction = db.transaction(['items', 'template_items'], 'readwrite');
    const itemsStore = transaction.objectStore('items');
    const templateStore = transaction.objectStore('template_items');
    const request = templateStore.getAll();

    request.onsuccess = (event) => {
        const templates = event.target.result;
        const currentWeek = getCurrentWeek();
        const templateItems = templates.filter(item => item.template_name === templateName);

        const itemsRequest = itemsStore.getAll();

        itemsRequest.onsuccess = (event) => {
            const currentItems = event.target.result;

            templateItems.forEach(templateItem => {
                const existingItem = currentItems.find(item => item.name === templateItem.name && item.unit === templateItem.unit && item.week === currentWeek);

                if (existingItem) {
                    existingItem.quantity += templateItem.quantity;
                    itemsStore.put(existingItem);
                } else {
                    const newItem = { ...templateItem, week: currentWeek };
                    delete newItem.id;
                    delete newItem.template_name;
                    itemsStore.add(newItem);
                }
            });

            const newTransaction = db.transaction(['items'], 'readwrite');
            newTransaction.oncomplete = () => {
                afficherItems(db);
                displayNotification('Template chargé avec succès', 'success');
            };

            newTransaction.onerror = (event) => {
                console.error('Erreur lors du chargement du template:', event.target.errorCode);
            };
        };

        itemsRequest.onerror = (event) => {
            console.error('Erreur lors de la récupération des items actuels:', event.target.errorCode);
        };
    };

    request.onerror = (event) => {
        console.error('Erreur lors du chargement du template:', event.target.errorCode);
    };
}

let templatesDisplayed = false;

function toggleDisplayTemplates(db) {
    const templateList = document.getElementById('template-list');
    if (templatesDisplayed) {
        templateList.style.display = 'none';
        templatesDisplayed = false;
    } else {
        displayTemplates(db);
        templateList.style.display = 'block';
        templatesDisplayed = true;
    }
}

function displayTemplates(db) {
    const transaction = db.transaction(['template_items'], 'readonly');
    const templateStore = transaction.objectStore('template_items');
    const request = templateStore.getAll();

    request.onsuccess = (event) => {
        const templates = event.target.result;
        const uniqueTemplates = [...new Set(templates.map(item => item.template_name))];
        const templateList = document.getElementById('template-list');
        templateList.innerHTML = '';

        if (uniqueTemplates.length > 0) {
            templateList.style.display = 'block';
        } else {
            templateList.style.display = 'none';
        }

        uniqueTemplates.forEach(templateName => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.textContent = templateName;

            const loadButton = document.createElement('button');
            loadButton.className = 'btn btn-success btn-sm';
            loadButton.textContent = 'Charger';
            loadButton.onclick = () => {
                loadTemplate(db, templateName);
            };

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.textContent = 'Supprimer';
            deleteButton.onclick = () => {
                deleteTemplate(db, templateName);
            };

            listItem.appendChild(loadButton);
            listItem.appendChild(deleteButton);
            templateList.appendChild(listItem);
        });
    };

    request.onerror = (event) => {
        console.error('Erreur lors de l\'affichage des templates:', event.target.errorCode);
    };
}

function deleteTemplate(db, templateName) {
    const transaction = db.transaction(['template_items'], 'readwrite');
    const templateStore = transaction.objectStore('template_items');
    const request = templateStore.getAll();

    request.onsuccess = (event) => {
        const templates = event.target.result;
        const templatesToDelete = templates.filter(item => item.template_name === templateName);

        templatesToDelete.forEach(item => {
            const deleteRequest = templateStore.delete(item.id);
            deleteRequest.onsuccess = () => {
                console.log(`Template supprimé : ${item.template_name}`);
            };
            deleteRequest.onerror = (event) => {
                console.error(`Erreur lors de la suppression du template : ${item.template_name}`, event.target.errorCode);
            };
        });

        transaction.oncomplete = () => {
            displayTemplates(db); // Refresh the list but do not hide it
        };
    };

    request.onerror = (event) => {
        console.error('Erreur lors de la récupération des templates pour suppression:', event.target.errorCode);
    };
}

function displayNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}
