import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "consultaFipe.sqlite";

const SQL_CREATE_ENTRIES = [
  `CREATE TABLE IF NOT EXISTS veiculossalvos (
      id INTEGER PRIMARY KEY autoincrement,
      tipo VARCHAR(255) NOT NULL,
      marca VARCHAR(255) NOT NULL,
      modelo VARCHAR(255) NOT NULL,
      ano VARCHAR(255) NOT NULL,
      anoId VARCHAR(255) NOT NULL,
      codigoFipe VARCHAR(255) NOT NULL,
      UNIQUE(codigoFipe, ano)
    )`,
];

let _db = null;

export function executeSql(query, params = []) {
  if (!_db) {
    openDB();
  }

  return new Promise((resolve, reject) => {
    _db.transaction((tx) => {
      tx.executeSql(
        query,
        params,
        (_, rs) => resolve(rs),
        (_, err) => reject(err)
      );
    });
  });
}

export default function openDB() {
  if (!_db) {
    _db = SQLite.openDatabase(DATABASE_NAME);
    _db.transaction(
      (tx) => {
        SQL_CREATE_ENTRIES.map((query) => {
          tx.executeSql(query);
        });
      },
      (err) => console.warn(err)
    );
  }

  return _db;
}
