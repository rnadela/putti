// THIS IS AN OLD IMPLEMENTATION ATTEMPT.  PLEASE DISREGARD
// THIS IS AN OLD IMPLEMENTATION ATTEMPT.  PLEASE DISREGARD
// THIS IS AN OLD IMPLEMENTATION ATTEMPT.  PLEASE DISREGARD
// THIS IS AN OLD IMPLEMENTATION ATTEMPT.  PLEASE DISREGARD
// THIS IS AN OLD IMPLEMENTATION ATTEMPT.  PLEASE DISREGARD
// THIS IS AN OLD IMPLEMENTATION ATTEMPT.  PLEASE DISREGARD
// THIS IS AN OLD IMPLEMENTATION ATTEMPT.  PLEASE DISREGARD
// THIS IS AN OLD IMPLEMENTATION ATTEMPT.  PLEASE DISREGARD
// THIS IS AN OLD IMPLEMENTATION ATTEMPT.  PLEASE DISREGARD
// THIS IS AN OLD IMPLEMENTATION ATTEMPT.  PLEASE DISREGARD
// THIS IS AN OLD IMPLEMENTATION ATTEMPT.  PLEASE DISREGARD
// THIS IS AN OLD IMPLEMENTATION ATTEMPT.  PLEASE DISREGARD
// THIS IS AN OLD IMPLEMENTATION ATTEMPT.  PLEASE DISREGARD
// THIS IS AN OLD IMPLEMENTATION ATTEMPT.  PLEASE DISREGARD

import axios from 'axios';

enum DataType {
  JSON,
  XML,
  CSV,
}

interface Company {
  id: string;
  name: string;
  uri: string;
  dataType: DataType;
  products: Product[];
}

interface Product {
  name: string;
  price: number;
}

abstract class Parser {
  parse: (data) => Product[];
}

class XmlParser implements Parser {
  parse(data): Product[] {
    // Use libraries like xml-js
    // return converted data from XML to JSON that'll match Product type
  }
}

class CsvParser implements Parser {
  parse(data): Product[] {
    // Use libraries like csvtojson
    // return converted data from CSV to JSON that'll match Product type
  }
}

class ProductService {
  async fetchProducts(company: Company) {
    let parser;
    switch (company.dataType) {
      case DataType.XML:
        parser = XmlParser;
        break;

      case DataType.CSV:
        parser = CsvParser;
        break;

      default:
        break;
    }

    const res = await axios.get(company.uri);

    return company.dataType === DataType.JSON
      ? res.data
      : parser.parse(res.data);
  }
}

async function GetProductsApi(req: Request, res: Response) {
  const { companyId } = req.query;
  // const products: Product[];

  const company: Company = await db.Company.findOne(companyId);

  try {
    const products = new ProductService().fetchProducts(company);

    res.json({
      company_name: company.name,
      products,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
}
