-- =========================================================
-- Seed inicial con datos de prueba
-- Ejecutar en el SQL Editor de Supabase, con las tablas ya creadas y vacias.
--
-- Si las tablas ya tienen datos y queres empezar de cero, descomenta este bloque.
-- ATENCION: borra TODOS los datos de estas tablas.
-- TRUNCATE "Turnos", "Servicios", "Usuarios", "Localidades", "Provincias" RESTART IDENTITY CASCADE;
-- =========================================================

BEGIN;

-- =========================
-- Provincias
-- =========================
INSERT INTO "Provincias" ("IdProvincia", "Provincia") VALUES
  (1, 'Buenos Aires'),
  (2, 'Córdoba'),
  (3, 'Santa Fe'),
  (4, 'Mendoza'),
  (5, 'Tucumán');

-- =========================
-- Localidades
-- =========================
INSERT INTO "Localidades" ("IdLocalidad", "Localidad") VALUES
  (1, 'Mar del Plata'),
  (2, 'La Plata'),
  (3, 'Córdoba Capital'),
  (4, 'Rosario'),
  (5, 'San Miguel de Tucumán');

-- =========================
-- Usuarios
-- Contraseña de todos: Pass1234 (guardada con bcrypt)
-- "lrodriguez" esta inactivo: el login debe devolver 401
-- =========================
INSERT INTO "Usuarios" ("IdUsuario", "IdLocalidad", "IdProvincia", "Usuario", "Password", "Token", "Estado",
                        "Nombres", "Apellidos", "Telefono", "DNI", "CUIL", "Email", "FechaAlta", "Calle") VALUES
  (1, 1, 1, 'admin',      '$2b$10$O1pWPjnPjxA7ho3szGi3nOs8cQLDKRtTeUAISN40.MqN1/Guf3Cny', NULL, 'A',
      'Admin',  'Sistema',   '2235000000', '30000000', '20300000001', 'admin@ejemplo.com',      '2026-09-01', 'Av. Colón 1000'),
  (2, 1, 1, 'jperez',     '$2b$10$O1pWPjnPjxA7ho3szGi3nOs8cQLDKRtTeUAISN40.MqN1/Guf3Cny', NULL, 'A',
      'Juan',   'Pérez',     '2235551234', '35123456', '20351234567', 'jperez@ejemplo.com',     '2026-09-10', 'Av. Independencia 2345'),
  (3, 3, 2, 'mgomez',     '$2b$10$O1pWPjnPjxA7ho3szGi3nOs8cQLDKRtTeUAISN40.MqN1/Guf3Cny', NULL, 'A',
      'María',  'Gómez',     '3515559876', '38987654', '27389876543', 'mgomez@ejemplo.com',     '2026-09-15', 'Bv. San Juan 450'),
  (4, 4, 3, 'lrodriguez', '$2b$10$O1pWPjnPjxA7ho3szGi3nOs8cQLDKRtTeUAISN40.MqN1/Guf3Cny', NULL, 'I',
      'Lucía',  'Rodríguez', '3415554321', '40111222', '27401112223', 'lrodriguez@ejemplo.com', '2026-09-20', 'Córdoba 1500');
-- Credenciales de prueba: admin / Pass1234 · jperez / Pass1234 · mgomez / Pass1234 · lrodriguez / Pass1234 (inactivo)

-- =========================
-- Servicios
-- "Alisado" esta dado de baja: no admite turnos nuevos y no aparece en /servicios/nombre/:nombre
-- =========================
INSERT INTO "Servicios" ("IdServicio", "Servicio", "Duracion", "Precio", "Estado") VALUES
  (1, 'Corte de pelo', 30,  8000.00,  'A'),
  (2, 'Corte y barba', 45,  11000.00, 'A'),
  (3, 'Coloración',    90,  25000.00, 'A'),
  (4, 'Peinado',       60,  15000.00, 'A'),
  (5, 'Alisado',       120, 40000.00, 'B');

-- =========================
-- Turnos
-- Del 1 al 3 de octubre: atendidos (A). Del 6 al 10: pendientes (P). Algunos cancelados (C).
-- Ningun turno no cancelado se superpone con otro del mismo servicio.
-- =========================
INSERT INTO "Turnos" ("IdTurno", "IdUsuario", "IdServicio", "Fecha", "Estado") VALUES
  -- Pasados
  (1,  2, 1, '2026-10-01 09:00', 'A'),
  (2,  3, 3, '2026-10-01 10:00', 'A'),
  (3,  2, 2, '2026-10-01 15:00', 'A'),
  (4,  3, 4, '2026-10-02 19:30', 'A'),
  (5,  2, 1, '2026-10-02 09:30', 'A'),
  (6,  3, 1, '2026-10-02 10:00', 'C'),
  (7,  2, 3, '2026-10-03 16:00', 'A'),
  (8,  3, 2, '2026-10-03 20:00', 'A'),
  -- Proximos
  (9,  2, 1, '2026-10-06 09:00', 'P'),
  (10, 3, 1, '2026-10-06 09:30', 'P'),
  (11, 2, 1, '2026-10-06 09:15', 'C'),  -- cancelado: se pisa con 9 y 10, pero no ocupa horario
  (12, 3, 3, '2026-10-06 14:00', 'P'),
  (13, 2, 4, '2026-10-07 18:00', 'P'),
  (14, 3, 2, '2026-10-08 20:00', 'P'),
  (15, 2, 3, '2026-10-10 11:00', 'P');

-- =========================
-- Como los IDs se cargaron a mano, se actualizan las secuencias
-- para que el proximo alta desde la API no choque con un ID existente
-- =========================
SELECT setval(pg_get_serial_sequence('"Provincias"',  'IdProvincia'), (SELECT MAX("IdProvincia") FROM "Provincias"));
SELECT setval(pg_get_serial_sequence('"Localidades"', 'IdLocalidad'), (SELECT MAX("IdLocalidad") FROM "Localidades"));
SELECT setval(pg_get_serial_sequence('"Usuarios"',    'IdUsuario'),   (SELECT MAX("IdUsuario")   FROM "Usuarios"));
SELECT setval(pg_get_serial_sequence('"Servicios"',   'IdServicio'),  (SELECT MAX("IdServicio")  FROM "Servicios"));
SELECT setval(pg_get_serial_sequence('"Turnos"',      'IdTurno'),     (SELECT MAX("IdTurno")     FROM "Turnos"));

COMMIT;

-- =========================================================
-- Resultados esperados para verificar la API
--
-- GET /turnos/resumen?desde=2026-10-01&hasta=2026-10-31
--   Mañana: cantidad 6, total 82000
--   Tarde:  cantidad 4, total 76000
--   Noche:  cantidad 3, total 37000
--
-- GET /turnos/ocupados/1?fecha=2026-10-06  -> turnos 9 y 10 (el 11 esta cancelado)
-- GET /servicios/nombre/corte              -> Corte de pelo, Corte y barba
-- POST /turnos { "idUsuario": 2, "idServicio": 1, "fecha": "2026-10-06T09:45:00" }  -> 409 (se pisa con el 10)
-- POST /turnos { "idUsuario": 2, "idServicio": 1, "fecha": "2026-10-06T10:00:00" }  -> 201
-- POST /turnos { "idUsuario": 2, "idServicio": 5, "fecha": "2026-10-06T10:00:00" }  -> 400 (servicio de baja)
-- =========================================================
