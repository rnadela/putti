// NOTES: IMPORTANT!!
// 1. Since parsers are decoupled and not company specific, can be reused to parse other 3rd party suppliers.
// 1. When adding a new 3rd party supplier, given with the same data type and format (JSON, XML, CSV), just need to add the company info, API url and the correct data type in the database.
// 3. Format specific parsers inherit from an abstract class to standardize the parser
// 4. Company object properties are encapsulated and can't be mutated outside of initialization.
// 5. I initially create subclasses from Company class for each specific company, but that would only be ideal if the number of suppliers does not increase.

import Express from 'express';
import axios from 'axios';

enum DataType {
  JSON = 'json',
  XML = 'xml',
  CSV = 'csv',
}

interface Product {
  name: string;
  price: string;
}

abstract class Parser {
  static parse: (data) => Product[];
}

function formatPrice(price: string) {
  return price[0] === '$' ? price : `$${price}`;
}

class JsonParser implements Parser {
  static parse(data: Product[]): Product[] {
    // Just need to parse the data to the standard output
    return data.map((e: Product) => ({ ...e, price: formatPrice(e.price) }));
  }
}

class XmlParser implements Parser {
  static parse(data): Product[] {
    // Use libraries like xml-js
    // return converted data from XML to JSON that'll match Product type
    return xml2Json(data);
  }
}

class CsvParser implements Parser {
  static parse(data): Product[] {
    // Use libraries like csvtojson
    // Change "Product Name" to "name"
    // return converted data from CSV to JSON that'll match Product type
    return csv2Json(data);
  }
}

class Company {
  private id: string;
  private name: string;
  private url: string;
  private dataType: DataType;
  private products: Product[];

  private async fetchProducts() {
    const res = await axios.get(this.url);

    let parser;
    switch (this.dataType) {
      case DataType.JSON:
        parser = JsonParser;
        break;

      case DataType.XML:
        parser = XmlParser;
        break;

      case DataType.CSV:
        parser = CsvParser;
        break;

      default:
        break;
    }

    this.products = parser.parse(res.data);
  }

  constructor(id: string) {
    this.id = id;
  }

  async initialize() {
    const company = await db.Company.findOne(this.id);

    this.name = company.name;
    this.url = company.url;
    this.dataType = company.dataType;

    await this.fetchProducts();
  }

  toJSON() {
    return {
      company_name: this.name,
      products: this.products,
    };
  }
}

async function GetProductsApi(req: Request, res: Response) {
  const { companyId } = req.query;

  try {
    const company = new Company(companyId);
    await company.initialize();

    res.json(company.toJSON());
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const app = Express();
app.get('/products', GetProductsApi);
