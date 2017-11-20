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

INSERT INTO PERSON (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, IS_ACTIVE, OFFICE_CODE, ROLE_CODE) VALUES ("Johnny","Depp", "jdepp@akap.pl", "e35bece6c5e6e0e86ca51d0440e92282a9d6ac8a", "Y", "WAW","EN");
INSERT INTO PERSON (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, IS_ACTIVE, OFFICE_CODE, ROLE_CODE) VALUES ("Leonardo","DiCaprio", "ldicaprio@akap.pl", "e35bece6c5e6e0e86ca51d0440e92282a9d6ac8a", "Y", "POZ","EN");
INSERT INTO PERSON (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, IS_ACTIVE, OFFICE_CODE, ROLE_CODE) VALUES ("Tom","Hanks", "thanks@bot.pl", "e35bece6c5e6e0e86ca51d0440e92282a9d6ac8a", "Y", "GDA","MG");
INSERT INTO PERSON (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, IS_ACTIVE, OFFICE_CODE, ROLE_CODE) VALUES ("Brad","Pitt", "bpitt@onet.pl", "e35bece6c5e6e0e86ca51d0440e92282a9d6ac8a", "Y", "KRK","EN");
INSERT INTO PERSON (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, IS_ACTIVE, OFFICE_CODE, ROLE_CODE) VALUES ("Ania","Oblatana", "oblec@gmail.com", "e35bece6c5e6e0e86ca51d0440e92282a9d6ac8a", "Y", "GDA","OP");
INSERT INTO PERSON (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, IS_ACTIVE, OFFICE_CODE, ROLE_CODE) VALUES ("Bozena","Wolska", "bwolska@gmail.com", "e35bece6c5e6e0e86ca51d0440e92282a9d6ac8a", "Y", "GDA","PR");
INSERT INTO PERSON (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, IS_ACTIVE, OFFICE_CODE, ROLE_CODE, COMPANY) VALUES ("Stevie","Wonder", "wonder@gmail.com", "", "N", "GDA","VE","Vision Express");
INSERT INTO PERSON (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, IS_ACTIVE, OFFICE_CODE, ROLE_CODE, COMPANY) VALUES ("Max","Kosiarz", "max@gmail.com", "", "N", "WAW","VE","Koszenie.pl");

-- TEST RELATED ITEMS
INSERT INTO RELATED_ITEM(ITEM_NO, DESCRIPTION, ADDRESS, MD_BUILDING_TYPE, MD_CONSTRUCTION_CATEGORY) VALUES ("WHX12323A", "WIEŻA DLA ORGRIMA DOOMHAMMERA", "ul. Hordy 3", "WIEŻA ORKÓW 1", "WIEŻA STRAŻNICZA");
INSERT INTO RELATED_ITEM(ITEM_NO, DESCRIPTION, ADDRESS, MD_BUILDING_TYPE, MD_CONSTRUCTION_CATEGORY) VALUES ("WHX12323", "ZAMEK DLA UTHERA", "pl. Sojuszu 1", "ZAMEK WAROWNY 1", "ZAMEK WAROWNY 1");

-- TEST ORDERS
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, PRICE, VENTURE_ID) VALUES ("WAW1", "AS", "AU", 8, "HRD", 1000, 7);


INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, PRICE, VENTURE_ID, MD_CAPEX, PROTOCOL_NO, DESCRIPTION, COMMENT, ITEM_ID) 
VALUES ("WAW2", "AS", "OT", 8, "HRD", 1000, 7, "CAPEX1", "PRO332211", "Stacja na szybko", "To jest to dziwne zamownienie", 1);

INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, PRICE, VENTURE_ID) VALUES ("POZ1", "CO", "BU", 8, "STD", 1000, 7);
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, PRICE, VENTURE_ID) VALUES ("POZ2", "AS", "PA", 8, "STD", 1000, 7);
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, PRICE, VENTURE_ID) VALUES ("GDA1", "AS", "AU", 8, "STD", 1000, 7);
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, PRICE, VENTURE_ID) VALUES ("GDA2", "CO", "OT", 8, "STD", 1000, 7);
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, PRICE, VENTURE_ID) VALUES ("KRK1", "AS", "BU", 8, "STD", 1000, 7);
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, PRICE, VENTURE_ID, MD_CAPEX) VALUES ("KRK2", "AS", "PA", 8, "STD", 1000, 7, "CAPEX123");
--orders for protocol
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, PRICE, VENTURE_ID) VALUES ("POZ11", "AC", "BU", 8, "STD", 1500, 7);
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, PRICE, VENTURE_ID) VALUES ("POZ22", "AC", "PA", 8, "STD", 2000, 7);
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, PRICE, VENTURE_ID) VALUES ("GDA11", "AC", "AU", 8, "STD", 1200, 8);
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, PRICE, VENTURE_ID) VALUES ("GDA22", "AC", "OT", 8, "STD", 1010, 8);
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, PRICE, VENTURE_ID) VALUES ("KRK11", "AC", "BU", 8, "STD", 1300, 7);
--orders for acceptation
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, PRICE, VENTURE_ID) VALUES ("POZ111", "IS", "BU", 8, "STD", 1500, 7);
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, PRICE, VENTURE_ID) VALUES ("POZ221", "IS", "PA", 8, "STD", 2000, 7);
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, PRICE, VENTURE_ID) VALUES ("GDA111", "IS", "AU", 8, "STD", 1200, 8);
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, PRICE, VENTURE_ID) VALUES ("GDA221", "IS", "OT", 8, "STD", 1010, 8);
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE, PRICE, VENTURE_ID) VALUES ("KRK111", "IS", "BU", 8, "STD", 1300, 7);



UPDATE WORK_ORDER SET LAST_MOD = STRFTIME('%s','2017-07-01 12:55:30') WHERE ID = 1;
UPDATE WORK_ORDER SET LAST_MOD = STRFTIME('%s','2017-07-06 12:55:30') WHERE ID = 2;
UPDATE WORK_ORDER SET LAST_MOD = STRFTIME('%s','2017-07-11 12:55:30') WHERE ID = 3;
UPDATE WORK_ORDER SET LAST_MOD = STRFTIME('%s','2017-07-16 12:55:30') WHERE ID = 4;
UPDATE WORK_ORDER SET LAST_MOD = STRFTIME('%s','2017-07-21 12:55:30') WHERE ID = 5;
UPDATE WORK_ORDER SET LAST_MOD = STRFTIME('%s','2017-07-26 12:55:30') WHERE ID = 6;


-- TEST WORK TYPES
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("PA", "WAW", "STD", 8, 1000);
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("PR", "WAW", "STD", 4, 3000);
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("BU", "WAW", "STD", 8, 2000);
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("AU", "WAW", "STD", 4, 500);
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("PA", "POZ", "STD", 8, 900);
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("PR", "POZ", "STD", 4, 2900);
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("BU", "POZ", "STD", 8, 1900);
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("AU", "POZ", "STD", 4, 400);
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("PA", "KRK", "STD", 8, 900);
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("PR", "KRK", "STD", 4, 2800);
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("BU", "KRK", "STD", 8, 1800);
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("AU", "KRK", "STD", 4, 300);
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("PA", "GDA", "STD", 8, 700);
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("PR", "GDA", "STD", 4, 2700);
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("BU", "GDA", "STD", 8, 1800);
INSERT INTO WORK_TYPE(TYPE_CODE, OFFICE_CODE, COMPLEXITY_CODE, COMPLEXITY, PRICE) VALUES ("AU", "GDA", "STD", 4, 200);

-- ceny z palaca dla "OT"; 


INSERT INTO PERSON_WO (PERSON_ID, WO_ID) VALUES (1,1);
INSERT INTO PERSON_WO (PERSON_ID, WO_ID) VALUES (1,2);
INSERT INTO PERSON_WO (PERSON_ID, WO_ID) VALUES (2,3);
INSERT INTO PERSON_WO (PERSON_ID, WO_ID) VALUES (2,4);
INSERT INTO PERSON_WO (PERSON_ID, WO_ID) VALUES (3,5);
INSERT INTO PERSON_WO (PERSON_ID, WO_ID) VALUES (3,6);
INSERT INTO PERSON_WO (PERSON_ID, WO_ID) VALUES (4,7);
INSERT INTO PERSON_WO (PERSON_ID, WO_ID) VALUES (4,8);

INSERT INTO TIME_SHEET (PERSON_ID, WORK_DATE, USED_TIME) VALUES(1, STRFTIME('%s','2017-07-01 00:00:00'), 4);
INSERT INTO TIME_SHEET (PERSON_ID, WORK_DATE, USED_TIME) VALUES(2, STRFTIME('%s','2017-07-01 00:00:00'), 6);
INSERT INTO TIME_SHEET (PERSON_ID, WORK_DATE, USED_TIME) VALUES(3, STRFTIME('%s','2017-07-01 00:00:00'), 5);
INSERT INTO TIME_SHEET (PERSON_ID, WORK_DATE, USED_TIME) VALUES(4, STRFTIME('%s','2017-07-01 00:00:00'), 7);



