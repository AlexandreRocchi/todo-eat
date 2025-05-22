var express = require('express');
var router = express.Router();
const mysql = require('mysql2');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Utiliser les variables d'environnement pour la connexion à la base de données
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'maria-admin',
  password: process.env.DB_PASSWORD || 'ffzaf1f545424H4IOUfybdzééjérfg5445',
  database: process.env.DB_NAME || 'bdd',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('Configuration de la base de données:', {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'maria-admin',
  database: process.env.DB_NAME || 'bdd'
});

router.get('/ping', function(req, res, next) {
  pool.query('SELECT 1', (err, results) => {
    if (err) return res.status(500).json({error: err.message});
    res.json({success: true, results});
  });
});

// Retourne tous les articles de courses
router.get('/grocery-items', function(req, res) {
  pool.query('SELECT * FROM grocery_items', (err, results) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(results);
  });
});

// Ajoute un nouvel article de courses
router.post('/grocery-items', function(req, res) {
  const { name, quantity, unit, checked, category } = req.body;
  if (!name || !quantity || !unit) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }
  const id = require('crypto').randomUUID();
  pool.query(
    'INSERT INTO grocery_items (id, name, quantity, unit, checked, category) VALUES (?, ?, ?, ?, ?, ?)',
    [id, name, quantity, unit, checked ?? false, category ?? null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id, name, quantity, unit, checked: checked ?? false, category: category ?? null });
    }
  );
});

// Supprime un article de courses par id
router.delete('/grocery-items/:id', function(req, res) {
  const { id } = req.params;
  pool.query('DELETE FROM grocery_items WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Article non trouvé' });
    res.json({ success: true });
  });
});

// Met à jour un article de courses par id
router.put('/grocery-items/:id', function(req, res) {
  const { id } = req.params;
  const { name, quantity, unit, checked, category } = req.body;
  pool.query(
    'UPDATE grocery_items SET name=?, quantity=?, unit=?, checked=?, category=? WHERE id=?',
    [name, quantity, unit, checked, category, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Article non trouvé' });
      res.json({ id, name, quantity, unit, checked, category });
    }
  );
});

// --- CRUD TEMPLATES ---
// GET tous les templates
router.get('/templates', function(req, res) {
  console.log('GET /templates - Récupération des templates');
  
  pool.query('SELECT * FROM templates', (err, templates) => {
    if (err) {
      console.error('Erreur lors de la récupération des templates:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('Templates récupérés:', templates.length);
    
    if (templates.length === 0) {
      return res.json([]);
    }
    
    // Récupérer les items associés à chaque template
    const templateIds = templates.map(t => t.id);
    console.log('IDs des templates:', templateIds);
    
    // Adapter la requête selon le nombre de templates
    let query = `
      SELECT ti.template_id, ti.item_id, gi.name, gi.quantity, gi.unit
      FROM template_items ti
      JOIN grocery_items gi ON ti.item_id = gi.id
    `;
    let params = [];
    
    if (templateIds.length === 1) {
      query += ' WHERE ti.template_id = ?';
      params = [templateIds[0]];
    } else {
      query += ' WHERE ti.template_id IN (?)';
      params = [templateIds];
    }
    
    console.log('Requête SQL:', query);
    console.log('Paramètres:', params);
    
    pool.query(query, params, (err2, templateItems) => {
      if (err2) {
        console.error('Erreur lors de la récupération des items de template:', err2);
        return res.status(500).json({ error: err2.message });
      }
      
      console.log('Items de template récupérés:', templateItems.length);
      console.log('Détails des items:', JSON.stringify(templateItems));
      
      // Regrouper les items par template
      const itemsByTemplate = {};
      templateItems.forEach(ti => {
        if (!itemsByTemplate[ti.template_id]) {
          itemsByTemplate[ti.template_id] = [];
        }
        itemsByTemplate[ti.template_id].push({
          id: ti.item_id,
          name: ti.name,
          quantity: ti.quantity,
          unit: ti.unit
        });
      });
      
      console.log('Items regroupés par template:', JSON.stringify(itemsByTemplate));
      
      // Ajouter les items à chaque template
      const result = templates.map(t => ({
        id: t.id,
        name: t.name,
        createdAt: t.created_at,
        items: itemsByTemplate[t.id] || []
      }));
      
      console.log('Réponse finale:', JSON.stringify(result));
      res.json(result);
    });
  });
});

// POST un nouveau template
router.post('/templates', function(req, res) {
  const { name, createdAt, items } = req.body;
  console.log('POST /templates - Body:', req.body);
  console.log('Date reçue:', createdAt, 'Type:', typeof createdAt);
  
  if (!name || !createdAt || !Array.isArray(items)) {
    console.log('Validation error:', { name, createdAt, items });
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }
  
  // S'assurer que la date est au format MySQL YYYY-MM-DD HH:MM:SS
  let formattedDate = createdAt;
  if (typeof createdAt === 'string') {
    // Si c'est une date ISO, la convertir
    if (createdAt.includes('T') || createdAt.includes('Z')) {
      try {
        const date = new Date(createdAt);
        formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
        console.log('Date convertie:', formattedDate);
      } catch (e) {
        console.error('Erreur lors de la conversion de la date:', e);
      }
    }
  }
  
  const templateId = require('crypto').randomUUID();
  console.log('Template ID généré:', templateId);
  
  // Première étape : créer le template
  pool.query(
    'INSERT INTO templates (id, name, created_at) VALUES (?, ?, ?)',
    [templateId, name, formattedDate],
    (err) => {
      if (err) {
        console.error('Erreur lors de la création du template:', err);
        return res.status(500).json({ error: err.message });
      }
      
      console.log('Template créé avec succès');
      
      // Si pas d'items, on retourne directement le template
      if (!items || items.length === 0) {
        console.log('Pas d\'items, retour du template vide');
        return res.status(201).json({ id: templateId, name, createdAt, items: [] });
      }
      
      // Deuxième étape : vérifier que tous les items existent dans la base
      console.log('Vérification des items:', items);
      
      // Requête SQL pour vérifier l'existence des IDs d'articles
      let query = 'SELECT * FROM grocery_items WHERE id IN (?)';
      let params = [items];
      
      // Si un seul élément, MySQL attend une valeur et non un tableau
      if (items.length === 1) {
        query = 'SELECT * FROM grocery_items WHERE id = ?';
        params = [items[0]];
      }
      
      pool.query(query, params, (errCheck, results) => {
        if (errCheck) {
          console.error('Erreur lors de la vérification des items:', errCheck);
          // Supprimer le template en cas d'erreur
          pool.query('DELETE FROM templates WHERE id = ?', [templateId]);
          return res.status(500).json({ error: errCheck.message });
        }
        
        console.log('Résultats de la vérification:', results);
        
        // Vérifier si tous les IDs existent
        const existingIds = results.map(row => row.id);
        const missingIds = items.filter(id => !existingIds.includes(id));
        
        if (missingIds.length > 0) {
          console.log('IDs manquants:', missingIds);
          // Supprimer le template créé puisque les items sont invalides
          pool.query('DELETE FROM templates WHERE id = ?', [templateId]);
          return res.status(400).json({ 
            error: 'Un ou plusieurs IDs d\'articles n\'existent pas dans la base.',
            missingIds
          });
        }
        
        // Troisième étape : insérer les relations template-items
        // Préparer les valeurs pour l'insertion multiple
        const values = items.map(itemId => [templateId, itemId]);
        console.log('Valeurs pour insertion:', values);
        
        // Utiliser la syntaxe correcte pour les insertions multiples
        pool.query(
          'INSERT INTO template_items (template_id, item_id) VALUES ?', 
          [values],
          (err2) => {
            if (err2) {
              console.error('Erreur lors de l\'insertion des items:', err2);
              // En cas d'erreur, supprimer le template créé
              pool.query('DELETE FROM templates WHERE id = ?', [templateId]);
              return res.status(500).json({ error: err2.message });
            }
            
            console.log('Items insérés avec succès');
            
            // Créer un tableau d'objets complets pour les articles
            const itemObjects = results.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              unit: item.unit
            }));
            
            // Tout s'est bien passé
            res.status(201).json({ id: templateId, name, createdAt, items: itemObjects });
          }
        );
      });
    }
  );
});

// PUT (update) un template
router.put('/templates/:id', function(req, res) {
  const { id } = req.params;
  const { name, createdAt, items } = req.body;
  pool.query(
    'UPDATE templates SET name=?, created_at=? WHERE id=?',
    [name, createdAt, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      // On supprime les anciens items puis on insère les nouveaux
      pool.query('DELETE FROM template_items WHERE template_id=?', [id], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        if (!Array.isArray(items) || items.length === 0) return res.json({ id, name, createdAt, items: [] });
        const values = items.map(itemId => [id, itemId]);
        pool.query('INSERT INTO template_items (template_id, item_id) VALUES ?', [values], (err3) => {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json({ id, name, createdAt, items });
        });
      });
    }
  );
});

// DELETE un template
router.delete('/templates/:id', function(req, res) {
  const { id } = req.params;
  pool.query('DELETE FROM templates WHERE id=?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Template non trouvé' });
    res.json({ success: true });
  });
});

// --- CRUD RECIPES ---
// GET toutes les recettes
router.get('/recipes', function(req, res) {
  pool.query('SELECT * FROM recipes', (err, recipes) => {
    if (err) return res.status(500).json({ error: err.message });
    // Pour chaque recette, on récupère les ingrédients
    const recipeIds = recipes.map(r => r.id);
    if (recipeIds.length === 0) return res.json([]);
    pool.query('SELECT * FROM ingredients WHERE recipe_id IN (?)', [recipeIds], (err2, ingredients) => {
      if (err2) return res.status(500).json({ error: err2.message });
      // On regroupe les ingrédients par recette
      const byRecipe = {};
      ingredients.forEach(i => {
        if (!byRecipe[i.recipe_id]) byRecipe[i.recipe_id] = [];
        byRecipe[i.recipe_id].push(i);
      });
      const result = recipes.map(r => ({ ...r, ingredients: byRecipe[r.id] || [] }));
      res.json(result);
    });
  });
});

// POST une nouvelle recette
router.post('/recipes', function(req, res) {
  const { name, instructions, image, createdAt, ingredients } = req.body;
  console.log('POST /recipes - Body:', req.body);
  console.log('Date reçue:', createdAt, 'Type:', typeof createdAt);
  
  if (!name || !createdAt || !Array.isArray(ingredients)) {
    console.log('Validation error:', { name, createdAt, ingredients });
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }
  
  // S'assurer que la date est au format MySQL YYYY-MM-DD HH:MM:SS
  let formattedDate = createdAt;
  if (typeof createdAt === 'string') {
    // Si c'est une date ISO, la convertir
    if (createdAt.includes('T') || createdAt.includes('Z')) {
      try {
        const date = new Date(createdAt);
        formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
        console.log('Date convertie:', formattedDate);
      } catch (e) {
        console.error('Erreur lors de la conversion de la date:', e);
      }
    }
  }
  
  const recipeId = require('crypto').randomUUID();
  pool.query(
    'INSERT INTO recipes (id, name, instructions, image, created_at) VALUES (?, ?, ?, ?, ?)',
    [recipeId, name, instructions ?? null, image ?? null, formattedDate],
    (err) => {
      if (err) {
        console.error('Erreur lors de la création de la recette:', err);
        return res.status(500).json({ error: err.message });
      }
      
      console.log('Recette créée avec succès');
      
      if (ingredients.length === 0) {
        return res.status(201).json({ id: recipeId, name, instructions, image, createdAt, ingredients: [] });
      }
      
      const values = ingredients.map(ing => [require('crypto').randomUUID(), recipeId, ing.name, ing.quantity, ing.unit]);
      pool.query(
        'INSERT INTO ingredients (id, recipe_id, name, quantity, unit) VALUES ?', [values],
        (err2) => {
          if (err2) {
            console.error('Erreur lors de l\'ajout des ingrédients:', err2);
            return res.status(500).json({ error: err2.message });
          }
          
          console.log('Ingrédients ajoutés avec succès');
          res.status(201).json({ id: recipeId, name, instructions, image, createdAt, ingredients });
        }
      );
    }
  );
});

// PUT (update) une recette
router.put('/recipes/:id', function(req, res) {
  const { id } = req.params;
  const { name, instructions, image, createdAt, ingredients } = req.body;
  console.log('PUT /recipes/:id - Body:', req.body);
  
  // S'assurer que la date est au format MySQL YYYY-MM-DD HH:MM:SS
  let formattedDate = createdAt;
  if (typeof createdAt === 'string') {
    // Si c'est une date ISO, la convertir
    if (createdAt.includes('T') || createdAt.includes('Z')) {
      try {
        const date = new Date(createdAt);
        formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
        console.log('Date convertie:', formattedDate);
      } catch (e) {
        console.error('Erreur lors de la conversion de la date:', e);
      }
    }
  }
  
  pool.query(
    'UPDATE recipes SET name=?, instructions=?, image=?, created_at=? WHERE id=?',
    [name, instructions, image, formattedDate, id],
    (err, result) => {
      if (err) {
        console.error('Erreur lors de la mise à jour de la recette:', err);
        return res.status(500).json({ error: err.message });
      }
      
      // On supprime les anciens ingrédients puis on insère les nouveaux
      pool.query('DELETE FROM ingredients WHERE recipe_id=?', [id], (err2) => {
        if (err2) {
          console.error('Erreur lors de la suppression des anciens ingrédients:', err2);
          return res.status(500).json({ error: err2.message });
        }
        
        if (!Array.isArray(ingredients) || ingredients.length === 0) {
          return res.json({ id, name, instructions, image, createdAt, ingredients: [] });
        }
        
        const values = ingredients.map(ing => [require('crypto').randomUUID(), id, ing.name, ing.quantity, ing.unit]);
        pool.query('INSERT INTO ingredients (id, recipe_id, name, quantity, unit) VALUES ?', [values], (err3) => {
          if (err3) {
            console.error('Erreur lors de l\'ajout des nouveaux ingrédients:', err3);
            return res.status(500).json({ error: err3.message });
          }
          
          console.log('Recette mise à jour avec succès');
          res.json({ id, name, instructions, image, createdAt, ingredients });
        });
      });
    }
  );
});

// DELETE une recette
router.delete('/recipes/:id', function(req, res) {
  const { id } = req.params;
  pool.query('DELETE FROM recipes WHERE id=?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Recette non trouvée' });
    res.json({ success: true });
  });
});

// --- CRUD SHOPPING LISTS ---
// GET toutes les listes
router.get('/shopping-lists', function(req, res) {
  pool.query('SELECT * FROM shopping_lists', (err, lists) => {
    if (err) return res.status(500).json({ error: err.message });
    const listIds = lists.map(l => l.id);
    if (listIds.length === 0) return res.json([]);
    pool.query('SELECT * FROM shopping_list_items WHERE shopping_list_id IN (?)', [listIds], (err2, sli) => {
      if (err2) return res.status(500).json({ error: err2.message });
      // On regroupe les items par liste
      const byList = {};
      sli.forEach(i => {
        if (!byList[i.shopping_list_id]) byList[i.shopping_list_id] = [];
        byList[i.shopping_list_id].push(i.item_id);
      });
      const result = lists.map(l => ({ ...l, items: byList[l.id] || [] }));
      res.json(result);
    });
  });
});

// POST une nouvelle liste
router.post('/shopping-lists', function(req, res) {
  const { createdAt, items } = req.body;
  console.log('POST /shopping-lists - Body:', req.body);
  
  if (!createdAt || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }
  
  // S'assurer que la date est au format MySQL YYYY-MM-DD HH:MM:SS
  let formattedDate = createdAt;
  if (typeof createdAt === 'string') {
    // Si c'est une date ISO, la convertir
    if (createdAt.includes('T') || createdAt.includes('Z')) {
      try {
        const date = new Date(createdAt);
        formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
        console.log('Date convertie:', formattedDate);
      } catch (e) {
        console.error('Erreur lors de la conversion de la date:', e);
      }
    }
  }
  
  const listId = require('crypto').randomUUID();
  pool.query(
    'INSERT INTO shopping_lists (id, created_at) VALUES (?, ?)',
    [listId, formattedDate],
    (err) => {
      if (err) {
        console.error('Erreur lors de la création de la liste:', err);
        return res.status(500).json({ error: err.message });
      }
      
      if (items.length === 0) {
        return res.status(201).json({ id: listId, createdAt, items: [] });
      }
      
      const values = items.map(itemId => [listId, itemId]);
      pool.query('INSERT INTO shopping_list_items (shopping_list_id, item_id) VALUES ?', [values], (err2) => {
        if (err2) {
          console.error('Erreur lors de l\'ajout des articles à la liste:', err2);
          return res.status(500).json({ error: err2.message });
        }
        
        console.log('Liste de courses créée avec succès');
        res.status(201).json({ id: listId, createdAt, items });
      });
    }
  );
});

// PUT (update) une liste
router.put('/shopping-lists/:id', function(req, res) {
  const { id } = req.params;
  const { createdAt, items } = req.body;
  console.log('PUT /shopping-lists/:id - Body:', req.body);
  
  // S'assurer que la date est au format MySQL YYYY-MM-DD HH:MM:SS
  let formattedDate = createdAt;
  if (typeof createdAt === 'string') {
    // Si c'est une date ISO, la convertir
    if (createdAt.includes('T') || createdAt.includes('Z')) {
      try {
        const date = new Date(createdAt);
        formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
        console.log('Date convertie:', formattedDate);
      } catch (e) {
        console.error('Erreur lors de la conversion de la date:', e);
      }
    }
  }
  
  pool.query(
    'UPDATE shopping_lists SET created_at=? WHERE id=?',
    [formattedDate, id],
    (err, result) => {
      if (err) {
        console.error('Erreur lors de la mise à jour de la liste:', err);
        return res.status(500).json({ error: err.message });
      }
      
      pool.query('DELETE FROM shopping_list_items WHERE shopping_list_id=?', [id], (err2) => {
        if (err2) {
          console.error('Erreur lors de la suppression des anciens articles:', err2);
          return res.status(500).json({ error: err2.message });
        }
        
        if (!Array.isArray(items) || items.length === 0) {
          return res.json({ id, createdAt, items: [] });
        }
        
        const values = items.map(itemId => [id, itemId]);
        pool.query('INSERT INTO shopping_list_items (shopping_list_id, item_id) VALUES ?', [values], (err3) => {
          if (err3) {
            console.error('Erreur lors de l\'ajout des nouveaux articles:', err3);
            return res.status(500).json({ error: err3.message });
          }
          
          console.log('Liste de courses mise à jour avec succès');
          res.json({ id, createdAt, items });
        });
      });
    }
  );
});

// DELETE une liste
router.delete('/shopping-lists/:id', function(req, res) {
  const { id } = req.params;
  pool.query('DELETE FROM shopping_lists WHERE id=?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Liste non trouvée' });
    res.json({ success: true });
  });
});

module.exports = router;
