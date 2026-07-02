INSERT INTO exercisesgig (

    target_word, category, difficulty, is_active, 

    level1_text, level2_text, level3_text, 

    created_at, updated_at

) VALUES

    -- Animals

    ('Dog',    'Animals', 1, TRUE, 'Dog',    'Dog is running',    'The dog is eating a bone',    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('Cat',    'Animals', 1, TRUE, 'Cat',    'Cat is sleeping',   'The cat is drinking milk',    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('Rabbit', 'Animals', 1, TRUE, 'Rabbit', 'Rabbit is hopping', 'The rabbit is eating a carrot', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('Bird',   'Animals', 1, TRUE, 'Bird',   'Bird is flying',    'The bird is in the tree',     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('Fish',   'Animals', 1, TRUE, 'Fish',   'Fish is swimming',  'The fish is in the water',    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('Lion',   'Animals', 2, TRUE, 'Lion',   'Lion is roaring',   'The lion is very strong',     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('Frog',   'Animals', 2, TRUE, 'Frog',   'Frog is jumping',   'The frog is on a leaf',       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    

    -- Fruits

    ('Apple',  'Fruits',  1, TRUE, 'Apple',  'Red apple',         'The apple is crunchy',        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('Banana', 'Fruits',  1, TRUE, 'Banana', 'Yellow banana',     'The banana is sweet',         CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('Mango',  'Fruits',  1, TRUE, 'Mango',  'Ripe mango',        'The mango is juicy',          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('Orange', 'Fruits',  1, TRUE, 'Orange', 'Round orange',      'The orange is sour',          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('Grapes', 'Fruits',  1, TRUE, 'Grapes', 'Purple grapes',     'The grapes are small',        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    

    -- Things

    ('Ball',   'Things',  1, TRUE, 'Ball',   'Big ball',          'The ball is bouncing',        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('Water',  'Things',  1, TRUE, 'Water',  'Cold water',        'The water is clean',          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('House',  'Things',  1, TRUE, 'House',  'Big house',         'The house is blue',           CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('Car',    'Things',  1, TRUE, 'Car',    'Fast car',          'The car is red',              CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('Book',   'Things',  1, TRUE, 'Book',   'New book',          'The book is on the table',    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); 

