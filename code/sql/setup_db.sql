-- work-monitor schema
-- v1 2017-07-27
-- PRAGMA journal_mode = DELETE;
-- PRAGMA busy_timeout = 1000;

DROP TABLE IF EXISTS SETTINGS;
CREATE TABLE SETTINGS (
    PARAM_NAME VARCHAR(255),
    PARAM_VAL VARCHAR(255)
);

DROP TABLE IF EXISTS CODE_REFERENCE;
CREATE TABLE CODE_REFERENCE (
	ID INTEGER PRIMARY KEY AUTOINCREMENT,
	CODE_TABLE VARCHAR(20) NOT NULL,
	CODE VARCHAR(10) NOT NULL,
	PARAM_INTVAL INTEGER,
	PARAM_CHARVAL VARCHAR(255)
);

DROP INDEX IF EXISTS CODE_TABLE_IDX;
DROP INDEX IF EXISTS CODE_IDX;
CREATE INDEX CODE_TABLE_IDX ON CODE_REFERENCE(CODE_TABLE);
CREATE INDEX CODE_IDX ON CODE_REFERENCE(CODE_TABLE,CODE);

DROP TABLE IF EXISTS PERSON;
CREATE TABLE PERSON (
	ID INTEGER PRIMARY KEY AUTOINCREMENT,
	FIRST_NAME VARCHAR(255) NOT NULL,
	LAST_NAME VARCHAR(255) NOT NULL,
    EMAIL VARCHAR(10) UNIQUE NOT NULL,
    PASSWORD VARCHAR(100),
	PWD_TOKEN VARCHAR(100),
    IS_ACTIVE VARCHAR(1) NOT NULL,    
	OFFICE_CODE VARCHAR(10) NOT NULL,
    ROLE_CODE VARCHAR(10) NOT NULL,
	COMPANY VARCHAR(100),
	ACCOUNT VARCHAR(100),
	PHONE VARCHAR(20),
	POSITION VARCHAR(50),
	ADDRESS_STREET VARCHAR(100),
	ADDRESS_POST VARCHAR(100),
	PROJECT_FACTOR REAL
);

DROP TABLE IF EXISTS WORK_ORDER;
CREATE TABLE WORK_ORDER (
	ID INTEGER PRIMARY KEY AUTOINCREMENT,
	WORK_NO VARCHAR(200) NOT NULL,
	STATUS_CODE VARCHAR(10) NOT NULL,
	TYPE_CODE VARCHAR(10) NOT NULL,
    COMPLEXITY_CODE VARCHAR(10) NOT NULL,
    COMPLEXITY INTEGER,
    DESCRIPTION VARCHAR(255),
    COMMENT VARCHAR(255),
    MD_CAPEX VARCHAR(255), --MD stands for META-DATA
	-- MD_BUILDING_TYPE VARCHAR(255),
    -- MD_CONSTRUCTION_CATEGORY VARCHAR(255),
	-- ADDRESS VARCHAR(255),
	PROTOCOL_NO VARCHAR(255),
    PRICE INTEGER,
	CREATED INTEGER,
	LAST_MOD INTEGER,
	LAST_ASSIGNMENT INTEGER,
	ITEM_ID INTEGER,
	VENTURE_ID INTEGER,
	FOREIGN KEY(ITEM_ID) REFERENCES RELATED_ITEM(ID),
	FOREIGN KEY(VENTURE_ID) REFERENCES PERSON(ID)
);

DROP INDEX IF EXISTS WORK_ORDER_NO_IDX;
CREATE INDEX WORK_ORDER_NO_IDX ON WORK_ORDER(WORK_NO);

DROP TABLE IF EXISTS WORK_ORDER_HIST;
CREATE TABLE WORK_ORDER_HIST (
	ID INTEGER,
	WORK_NO VARCHAR(200),
	STATUS_CODE VARCHAR(10),
	TYPE_CODE VARCHAR(10) NOT NULL,
    COMPLEXITY_CODE VARCHAR(10),
    COMPLEXITY INTEGER,
    DESCRIPTION VARCHAR(255),
    COMMENT VARCHAR(255),
    MD_CAPEX VARCHAR(255), --MD stands for META-DATA
    -- MD_BUILDING_TYPE VARCHAR(255),
    -- MD_CONSTRUCTION_CATEGORY VARCHAR(255),
    PRICE INTEGER,
	LAST_MOD INTEGER,
	HIST_CREATE INTEGER
);

DROP INDEX IF EXISTS WORK_ORDER_HIST_ID_IDX;
CREATE INDEX WORK_ORDER_HIST_ID_IDX ON WORK_ORDER_HIST(ID);


DROP TABLE IF EXISTS RELATED_ITEM;
CREATE TABLE RELATED_ITEM (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
	ITEM_NO VARCHAR(200),
    DESCRIPTION VARCHAR(255),
	ADDRESS VARCHAR(255),
    MD_BUILDING_TYPE VARCHAR(255),
    MD_CONSTRUCTION_CATEGORY VARCHAR(255),
	CREATED INTEGER
);

DROP INDEX IF EXISTS RELATED_ITEM_ID_IDX;
CREATE INDEX RELATED_ITEM_ID_IDX ON RELATED_ITEM(ID);


DROP TABLE IF EXISTS ADDRESS;
CREATE TABLE ADDRESS (
	ID INTEGER PRIMARY KEY AUTOINCREMENT,
	CITY VARCHAR(100),
	POSTAL_CODE VARCHAR(5) NOT NULL,
	POST_OFFICE VARCHAR(100) NOT NULL,
	STREET VARCHAR(255) NOT NULL,
	STREET_NO VARCHAR(10) NOT NULL,
	APART_NO VARCHAR(10),
	COUNTRY VARCHAR(100) NOT NULL,
	WO_ID INTEGER NOT NULL,
    FOREIGN KEY(WO_ID) REFERENCES WORK_ORDER(ID)
);

DROP TABLE IF EXISTS WORK_TYPE;
CREATE TABLE WORK_TYPE (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    TYPE_CODE VARCHAR(10) NOT NULL,
    OFFICE_CODE VARCHAR(10) NOT NULL,
    COMPLEXITY_CODE VARCHAR(10) NOT NULL,
    COMPLEXITY INTEGER,
    PRICE INTEGER
);

DROP TABLE IF EXISTS PERSON_WO;
CREATE TABLE PERSON_WO (
	PERSON_ID INTEGER NOT NULL,
	WO_ID INTEGER NOT NULL,
	CREATED INTEGER,
	UNIQUE (PERSON_ID, WO_ID) ON CONFLICT IGNORE,
    FOREIGN KEY(PERSON_ID) REFERENCES PERSON(ID),
    FOREIGN KEY(WO_ID) REFERENCES WORK_ORDER(ID)
);

DROP INDEX IF EXISTS PERSON_WO_PID_IDX;
DROP INDEX IF EXISTS PERSON_WO_WID_IDX;
CREATE INDEX PERSON_WO_PID_IDX ON PERSON_WO(PERSON_ID);
CREATE INDEX PERSON_WO_WID_IDX ON PERSON_WO(WO_ID);

DROP TABLE IF EXISTS TIME_SHEET;
CREATE TABLE TIME_SHEET (
	PERSON_ID INTEGER NOT NULL,
	WORK_DATE INTEGER NOT NULL,
	USED_TIME NUMBER NOT NULL,
	-- new fields
	FROM_DATE INTEGER NOT NULL,
	TO_DATE INTEGER NOT NULL,
	BREAK_IN_MINUTES NUMBER NOT NULL,
	
	UNIQUE (WORK_DATE, PERSON_ID) ON CONFLICT IGNORE,
	FOREIGN KEY(PERSON_ID) REFERENCES PERSON(ID)
);

PRAGMA foreign_keys = ON;

DROP TRIGGER IF EXISTS LOG_WO;
DROP TRIGGER IF EXISTS SET_TIMING_WORK_ORDER;
DROP TRIGGER IF EXISTS SET_TIMING_RELATED_ITEM;
DROP TRIGGER IF EXISTS SET_TIMING_PERSON_WO;


CREATE TRIGGER LOG_WO BEFORE UPDATE ON WORK_ORDER
WHEN
    OLD.STATUS_CODE <> NEW.STATUS_CODE
BEGIN
    INSERT INTO WORK_ORDER_HIST ( ID, WORK_NO, STATUS_CODE, TYPE_CODE, COMMENT, MD_CAPEX, DESCRIPTION, COMPLEXITY_CODE, COMPLEXITY, PRICE, LAST_MOD, HIST_CREATE )
    VALUES ( OLD.ID, OLD.WORK_NO, OLD.STATUS_CODE, OLD.TYPE_CODE, OLD.COMMENT, OLD.MD_CAPEX, OLD.DESCRIPTION, OLD.COMPLEXITY_CODE, OLD.COMPLEXITY, OLD.PRICE, OLD.LAST_MOD, STRFTIME('%s','NOW') );
    
    UPDATE WORK_ORDER 
    SET LAST_MOD = STRFTIME('%s','NOW')
    WHERE ID = OLD.ID;
END;

CREATE TRIGGER SET_TIMING_WORK_ORDER AFTER INSERT ON WORK_ORDER
WHEN
    NEW.CREATED IS NULL
BEGIN
    UPDATE WORK_ORDER
	SET LAST_MOD = STRFTIME('%s','NOW'), CREATED = STRFTIME('%s','NOW')
	WHERE ID = NEW.ID;
END;

CREATE TRIGGER SET_TIMING_RELATED_ITEM AFTER INSERT ON RELATED_ITEM
WHEN
	NEW.CREATED IS NULL
BEGIN
	UPDATE RELATED_ITEM
	SET CREATED = STRFTIME('%s','NOW')
	WHERE ID = NEW.ID;
END;

CREATE TRIGGER SET_TIMING_PERSON_WO AFTER INSERT ON PERSON_WO
WHEN
	NEW.CREATED IS NULL
BEGIN
	UPDATE PERSON_WO
	SET CREATED = STRFTIME('%s','NOW')
	WHERE PERSON_ID = NEW.PERSON_ID AND WO_ID = NEW.WO_ID;
END;
