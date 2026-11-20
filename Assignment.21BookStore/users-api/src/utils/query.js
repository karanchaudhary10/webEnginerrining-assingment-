//This handles pagination, sorting ,and building navigation links for the API response

import { badRequest } from "./http-error.js";

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

//pagination -> process of breaking a large set of data into smaller chunks(Pages)
//for eg : if u have 10,000 products showing all at once may cause slowness or load the server instead of this u can divide it in smaller chunnks(page)like 20 | 10 products per page

export function parsePagination(query = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number.parseInt(query.limit, 10) || DEFAULT_LIMIT),
  );
  return { page, limit };
}

/* 
query.page-> read the page number from the url like (?page=2)
Number.parseInt(query.page,10)  convert to number if it missing then ||1 default will be 1 
MATH.max -> ensures page is at least 1 no 0 or neg  and the query.limit -> read limit (item per page)
by defualt limit-> 20  and in the math.min (max_limit, math.max) -> the whole fun ensure no more then 100 items per pagee and the math.max(1,..)-> ensures at least 1 item per page
*/

//  ?sort=-price-> sorts by price descending. only whitelisted field are allowed.
export function sortItems(items, sortParam, allowedFields) {
  if (sortParam === undefined) return items; // if no sort parameter exist it return the items;
  if (typeof sortParam !== "string")
    throw badRequest("sort must be a single field name"); //if short param isn't string it will throw bad request error

  const desc = sortParam.startsWith("-"); // string start with - , it means in descending order
  const field = desc ? sortParam.slice(1) : sortParam; //remove - to get actual field name eg "-price"-> desc = true , field = "price"
  if (!allowedFields.includes(field)) {
    //if allowedfields is an array it checks the reest field is allowed if not throw an error listing allowed field
    throw badRequest(
      `Cannot sort by "${field}". Allowed : ${allowedFields.join(", ")}`,
    );
  }
  const direction = desc ? -1 : 1; // -1 means descending and 1 is ascending
  return [...items].sort((a, b) => {
    //make a copy so the og array not chnage by comparing fild a and b if it same it return 0 and if not it check if the a field is greater then  b field if yes return the asc direaction if not then it retrun the desc direction
    if (a[field] === b[field]) return 0;
    return a[field] > b[field] ? direction : -direction;
  });
}

//slice one page out of an array and describe it
export function paginate(items, { page, limit }) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const data = items.slice((page - 1) * limit, page * limit);
  return { data, meta: { page, limit, total, totalPages } };
}

//Build self/next/prev links form the incoming request so filters and sort are preserved
export function pageLinks(req, { page, totalPages }) {
  const linkFor = (p) => {
    const url = new URL(req.originalUrl, "http://placeholder"); //base is required but discarded
    url.searchParams.set("page", p);
    return url.pathname + url.search;
  };
  return {
    self: linkFor(page),
    next: page < totalPages ? linkFor(page + 1) : null,
    prev: page > 1 ? linkFor(page - 1) : null,
  };
}
