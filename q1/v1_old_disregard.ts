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

class Shop {
  id: string;
  name: string;
}

class Product {
  name: string;
  price: number;
}

abstract class Service {
  companyName: string;
  protected parse: <T>(data: T) => Product[];
  fetch: () => Promise<Product[]>;
}

class KidsWorldService implements Service {
  companyName = 'Kids World';
  parse<T>() {
    // parse XML to JSON
  }
  async fetch(): Promise<Product[]> {
    const products = await fetchXml();
    return this.parse(products);
  }
}

class ToyUniverseService implements Service {
  companyName = 'Kids World';
  async fetch(): Promise<Product[]> {
    return fetchJson();
  }
}

class ToyShopService implements Service {
  companyName = 'Kids World';
  parse() {
    // parse CSV to JSON
  }
  async fetch(): Promise<Product[]> {
    const products = await fetchCsv();
    return this.parse(products);
  }
}

async function GetProductsApi(req: Request, res: Response) {
  const { shopId } = req.query;
  // const products: Product[];

  const shop = await db.Shop.findOne(shopId);

  let Service: typeof KidsWorldService | typeof ToyUniverseService;
  switch (shopId) {
    case 1:
      Service = KidsWorldService;
      break;

    case 2:
      Service = ToyUniverseService;
      break;

    case 2:
      Service = ToyShopService;
      break;

    default:
      break;
  }

  let products: Product[];
  try {
    const service = new Service();
    products = await service.fetch();

    res.json({
      company_name: service.companyName,
      products,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
}
