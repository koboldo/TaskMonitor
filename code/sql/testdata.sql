INSERT INTO SETTINGS (PARAM_NAME, PARAM_VAL) VALUES ("VERSION","1");

-- LOCATIONS
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("OFFICE","WAW","Warszawa");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("OFFICE","POZ","Poznań");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("OFFICE","KRK","Kraków");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("OFFICE","GDA","Gdańsk");

-- STATUSES FOR ORDER PROCESING
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_STATUS","OP","Otwarte");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_STATUS","AS","Przypisane");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_STATUS","CO","Zakończone");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_STATUS","IS","Wydane");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_STATUS","AC","Zaakceptowane");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_STATUS","CL","Zamknięte");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_STATUS","SU","Zawieszone");

-- WORK ORDER TYPES
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_TYPE","PA","Wyjazd");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_TYPE","PR","Projekt");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_TYPE","BU","Budowa");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_TYPE","AU","Audyt");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_TYPE","OT","Inne");

INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("ROLE","PR","Prezes");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("ROLE","OP","Operator");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("ROLE","MG","Kierownik");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("ROLE","EN","Inżynier");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("ROLE","VE","Przedstawiciel"); --VENTURE_REPRESENTATIVE
-- nie ma roli nowicjusz jest tylko wspolczynnik - zaszeregowanie INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("ROLE","NO","Nowicjusz");

-- WORK COMPLEXITY
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("COMPLEXITY", "STD", "Standardowy");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("COMPLEXITY", "HRD", "Ciężki");

-- TEST PERSONS
INSERT INTO PERSON (FIRST_NAME, LAST_NAME, LOGIN, PASSWORD, IS_ACTIVE, OFFICE_CODE, ROLE_CODE) VALUES ("Johnny","Depp", "jdepp", "e35bece6c5e6e0e86ca51d0440e92282a9d6ac8a", "Y", "WAW","EN");
INSERT INTO PERSON (FIRST_NAME, LAST_NAME, LOGIN, PASSWORD, IS_ACTIVE, OFFICE_CODE, ROLE_CODE) VALUES ("Leonardo","DiCaprio", "ldicaprio", "e35bece6c5e6e0e86ca51d0440e92282a9d6ac8a", "Y", "POZ","EN");
INSERT INTO PERSON (FIRST_NAME, LAST_NAME, LOGIN, PASSWORD, IS_ACTIVE, OFFICE_CODE, ROLE_CODE) VALUES ("Tom","Hanks", "thanks", "e35bece6c5e6e0e86ca51d0440e92282a9d6ac8a", "Y", "GDA","MG");
INSERT INTO PERSON (FIRST_NAME, LAST_NAME, LOGIN, PASSWORD, IS_ACTIVE, OFFICE_CODE, ROLE_CODE) VALUES ("Brad","Pitt", "bpitt", "e35bece6c5e6e0e86ca51d0440e92282a9d6ac8a", "Y", "KRK","EN");
INSERT INTO PERSON (FIRST_NAME, LAST_NAME, LOGIN, PASSWORD, IS_ACTIVE, OFFICE_CODE, ROLE_CODE) VALUES ("Ania","Oblatana", "oblec", "e35bece6c5e6e0e86ca51d0440e92282a9d6ac8a", "Y", "GDA","OP");
INSERT INTO PERSON (FIRST_NAME, LAST_NAME, LOGIN, PASSWORD, IS_ACTIVE, OFFICE_CODE, ROLE_CODE) VALUES ("Bozena","Wolska", "bwolska", "e35bece6c5e6e0e86ca51d0440e92282a9d6ac8a", "Y", "GDA","PR");

-- TEST ORDERS
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE) VALUES ("WAW1", "AS", "AU", 8, "STD");
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, MD_CAPEX, MD_BUILDING_TYPE, MD_CONSTRUCTION_CATEGORY) VALUES ("WAW2", "AS", "OT", 8, "STD", "CAPEX1", "WIEŻA ORKÓW 1", "WIEŻA STRAŻNICZA");
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE) VALUES ("POZ1", "CO", "BU", 8, "STD");
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE) VALUES ("POZ2", "AS", "PA", 8, "STD");
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE) VALUES ("GDA1", "AS", "AU", 8, "STD");
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE) VALUES ("GDA2", "CO", "OT", 8, "STD");
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE) VALUES ("KRK1", "AS", "BU", 8, "STD");
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, MD_CAPEX, MD_BUILDING_TYPE, MD_CONSTRUCTION_CATEGORY) VALUES ("KRK2", "AS", "PA", 8, "STD", "CAPEX123", "WIEŻA ORKÓW 2", "WIEŻA STRAŻNICZA");

UPDATE WORK_ORDER SET LAST_MOD = STRFTIME('%s','2017-07-01 12:55:30') WHERE ID = 1;
UPDATE WORK_ORDER SET LAST_MOD = STRFTIME('%s','2017-07-06 12:55:30') WHERE ID = 2;
UPDATE WORK_ORDER SET LAST_MOD = STRFTIME('%s','2017-07-11 12:55:30') WHERE ID = 3;
UPDATE WORK_ORDER SET LAST_MOD = STRFTIME('%s','2017-07-16 12:55:30') WHERE ID = 4;
UPDATE WORK_ORDER SET LAST_MOD = STRFTIME('%s','2017-07-21 12:55:30') WHERE ID = 5;
UPDATE WORK_ORDER SET LAST_MOD = STRFTIME('%s','2017-07-26 12:55:30') WHERE ID = 6;


-- TEST WORK TYPES
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("PR", "WAW", "STD", 8, 10000);
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("PR", "WAW", "HRD", 8, 20000);
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("PA", "WAW", "STD", 4, 100);
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("PA", "WAW", "HRD", 4, 200);

INSERT INTO PERSON_WO (PERSON_ID, WO_ID) VALUES (1,1);
INSERT INTO PERSON_WO (PERSON_ID, WO_ID) VALUES (1,2);
INSERT INTO PERSON_WO (PERSON_ID, WO_ID) VALUES (2,3);
INSERT INTO PERSON_WO (PERSON_ID, WO_ID) VALUES (2,4);
INSERT INTO PERSON_WO (PERSON_ID, WO_ID) VALUES (3,5);
INSERT INTO PERSON_WO (PERSON_ID, WO_ID) VALUES (3,6);
INSERT INTO PERSON_WO (PERSON_ID, WO_ID) VALUES (4,7);
INSERT INTO PERSON_WO (PERSON_ID, WO_ID) VALUES (4,8);



