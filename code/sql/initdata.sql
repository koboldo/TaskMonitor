INSERT INTO SETTINGS (PARAM_NAME, PARAM_VAL) VALUES ("VERSION","1");

-- LOCATIONS
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("OFFICE","WAW","Warszawa");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("OFFICE","POZ","Poznań");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("OFFICE","KRK","Kraków");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("OFFICE","GDA","Gdańsk");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("OFFICE","KAT","Katowice");

-- STATUSES FOR ORDER PROCESING
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_INTVAL, PARAM_CHARVAL) VALUES ("WORK_STATUS","OP", 1, "Otwarte");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_INTVAL, PARAM_CHARVAL) VALUES ("WORK_STATUS","AS", 2, "W realizacji");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_INTVAL, PARAM_CHARVAL) VALUES ("WORK_STATUS","CO", 3, "Zrealizowane");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_INTVAL, PARAM_CHARVAL) VALUES ("WORK_STATUS","IS", 4, "Wydane");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_INTVAL, PARAM_CHARVAL) VALUES ("WORK_STATUS","AC", 5, "Zaakceptowane");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_INTVAL, PARAM_CHARVAL) VALUES ("WORK_STATUS","CL", 6, "Zamknięte");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_INTVAL, PARAM_CHARVAL) VALUES ("WORK_STATUS","SU", 7, "Zawieszone");

-- ROLES
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("ROLE","PR","Prezes");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("ROLE","OP","Operator");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("ROLE","MG","Kierownik");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("ROLE","EN","Inżynier");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("ROLE","VE","Przedstawiciel");

-- AGREEMENT TYPES
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("AGREEMENT_TYPE","UOP","Umowa o pracę");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("AGREEMENT_TYPE","DG","Działalność gospodarcza");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("AGREEMENT_TYPE","UZ","Umowa zlecenie");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("AGREEMENT_TYPE","UOD","Umowa o dzieło");

-- WORK COMPLEXITY
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("COMPLEXITY", "STD", "Standardowe");
INSERT INTO CODE_REFERENCE (CODE_TABLE, CODE, PARAM_CHARVAL) VALUES ("COMPLEXITY", "HRD", "Złożone");
