INSERT INTO "User" (id, name, email) 
VALUES ('admin-1', 'PlazaKasir Admin', 'admin@plazakasir.com') 
ON CONFLICT (id) DO NOTHING;
