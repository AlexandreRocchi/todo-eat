const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Configurer la connexion
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'maria-admin',
  password: process.env.DB_PASSWORD || 'ffzaf1f545424H4IOUfybdzééjérfg5445',
  database: process.env.DB_NAME || 'bdd',
  multipleStatements: true // Important pour exécuter plusieurs requêtes à la fois
});

console.log('Connexion à la base de données...');
console.log('Host:', process.env.DB_HOST || 'localhost');

// Fonction pour attendre que la base de données soit disponible
function waitForDatabase(retries = 30, interval = 2000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const tryConnect = () => {
      console.log(`Tentative de connexion à la base de données (${attempts + 1}/${retries})...`);
      
      connection.connect((err) => {
        if (!err) {
          console.log('Connexion réussie à la base de données!');
          return resolve();
        }
        
        console.error('Erreur de connexion:', err.message);
        connection.end();
        
        attempts++;
        if (attempts >= retries) {
          return reject(new Error(`Impossible de se connecter à la base de données après ${retries} tentatives`));
        }
        
        // Recréer la connexion pour la prochaine tentative
        setTimeout(() => {
          connection = mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'maria-admin',
            password: process.env.DB_PASSWORD || 'ffzaf1f545424H4IOUfybdzééjérfg5445',
            database: process.env.DB_NAME || 'bdd',
            multipleStatements: true
          });
          tryConnect();
        }, interval);
      });
    };
    
    tryConnect();
  });
}

// Initialiser la base de données
async function initDatabase() {
  try {
    await waitForDatabase();
    
    // Lire le fichier SQL
    const sqlFilePath = path.join(__dirname, '../../db/dump.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('Exécution du script SQL...');
    
    // Exécuter le script SQL
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Erreur lors de l\'exécution du script SQL:', err);
        process.exit(1);
      }
      
      console.log('Base de données initialisée avec succès!');
      connection.end();
    });
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
}

// Exécuter l'initialisation
initDatabase(); 