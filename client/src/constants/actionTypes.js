//We made this file because if we were to use the string instead and we accidentally misspelled it,
//then the error would never show up and you may end up losing hours looking for the error
//this way, if we misspell these actions, now the program will be able to detect it and tell us
export const UPDATE = 'UPDATE';
export const FETCH_ALL = 'FETCH_ALL';
export const FETCH_POST = 'FETCH_POST';
export const FETCH_BY_SEARCH = 'FETCH_BY_SEARCH';
export const CREATE = 'CREATE';
export const DELETE = 'DELETE';
export const LIKE = 'LIKE';
export const COMMENT = 'COMMENT';

export const START_LOADING = 'START_LOADING';
export const END_LOADING = 'END_LOADING';

export const AUTH = 'AUTH';
export const LOGOUT = 'LOGOUT';