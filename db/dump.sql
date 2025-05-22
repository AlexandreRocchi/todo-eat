-- Schéma SQL pour TodoEat (MariaDB)

CREATE TABLE grocery_items (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity DOUBLE NOT NULL,
    unit VARCHAR(50) NOT NULL,
    checked BOOLEAN NOT NULL DEFAULT FALSE,
    category VARCHAR(100)
);

CREATE TABLE templates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL
);

CREATE TABLE template_items (
    template_id VARCHAR(36) NOT NULL,
    item_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (template_id, item_id),
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES grocery_items(id) ON DELETE CASCADE
);

CREATE TABLE recipes (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    instructions TEXT,
    image VARCHAR(512),
    created_at DATETIME NOT NULL
);

CREATE TABLE ingredients (
    id VARCHAR(36) PRIMARY KEY,
    recipe_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity DOUBLE NOT NULL,
    unit VARCHAR(50) NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE shopping_lists (
    id VARCHAR(36) PRIMARY KEY,
    created_at DATETIME NOT NULL
);

CREATE TABLE shopping_list_items (
    shopping_list_id VARCHAR(36) NOT NULL,
    item_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (shopping_list_id, item_id),
    FOREIGN KEY (shopping_list_id) REFERENCES shopping_lists(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES grocery_items(id) ON DELETE CASCADE
);
