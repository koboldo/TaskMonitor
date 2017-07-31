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
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_STATUS","AC","Zaakceptowane");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_STATUS","IS","Wydane");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_STATUS","CL","Zamknięte");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_STATUS","SU","Zawieszone");

-- WORK ORDER TYPES
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_TYPE","PA","Wyjazd");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_TYPE","PR","Projekt");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_TYPE","BU","Budowa");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_TYPE","AU","Audyt");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("WORK_TYPE","OT","Inne");

INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("ROLE","OP","Operator");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("ROLE","US","Pracownik");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("ROLE","MG","Kierownik");

-- PERSON GRADE
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("GRADE","NO","Nowicjusz");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("GRADE","EN","Inżynier");
-- INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("GRADE","MG","Kierownik");

-- WORK COMPLEXITY
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("COMPLEXITY", "STD", "Standardowy");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("COMPLEXITY", "HRD", "Ciężki");

-- TEST PERSONS
INSERT INTO PERSON (FIRST_NAME, LAST_NAME, OFFICE_CODE, GRADE_CODE) VALUES ("Johnny","Depp","WAW","EN");
INSERT INTO PERSON (FIRST_NAME, LAST_NAME, OFFICE_CODE, GRADE_CODE) VALUES ("Leonardo","DiCaprio","POZ","EN");
INSERT INTO PERSON (FIRST_NAME, LAST_NAME, OFFICE_CODE, GRADE_CODE) VALUES ("Tom","Hanks","GDA","MG");
INSERT INTO PERSON (FIRST_NAME, LAST_NAME, OFFICE_CODE, GRADE_CODE) VALUES ("Brad","Pitt","KRK","EN");

-- TEST ORDERS
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE) VALUES ("WAW1", "AS", "AU", 8, "STD");
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE) VALUES ("WAW2", "AS", "OT", 8, "STD");
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE) VALUES ("POZ1", "AS", "BU", 8, "STD");
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE) VALUES ("POZ2", "AS", "PA", 8, "STD");
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE) VALUES ("GDA1", "AS", "AU", 8, "STD");
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE) VALUES ("GDA2", "AS", "OT", 8, "STD");
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE) VALUES ("KRK1", "AS", "BU", 8, "STD");
INSERT INTO WORK_ORDER(WORK_NO, STATUS_CODE, TYPE_CODE, COMPLEXITY, COMPLEXITY_CODE) VALUES ("KRK2", "AS", "PA", 8, "STD");

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



