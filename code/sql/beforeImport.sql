ALTER TABLE PERSON
	ADD INITIALS VARCHAR(10) NOT NULL DEFAULT "";
CREATE UNIQUE INDEX INITIALS_IDX ON PERSON(INITIALS);
	
DROP TABLE IF EXISTS IMPORT_LOG;
CREATE TABLE IMPORT_LOG (
   TXT VARCHAR(1000)
);	
