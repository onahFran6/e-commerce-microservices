/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormatData } from "../util";
import { CreateProductInputType, ProductDoc } from "productType";
import ProductRepository from "../database/repository/product.repository";

class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async CreateProduct(
    ProductInputs: CreateProductInputType
  ): Promise<ProductDoc> {
    const { name, desc, type, unit, price, available, suplier, banner } =
      ProductInputs;

    //check if user already exists
    const newProduct = await this.repository.CreateProduct({
      name,
      desc,
      type,
      unit,
      price,
      available,
      suplier,
      banner,
    });

    return FormatData(newProduct);
  }

  async GetProducts(): Promise<Partial<ProductDoc[]>> {
    const products = await this.repository.FindAllProducts();
    const categories: { [key: string]: string } = {};

    products.forEach(({ type }: { type: string }) => {
      categories[type] = type;
    });

    return FormatData({
      products,
      categories: Object.keys(categories),
    });
  }

  async GetProductDescription({
    productId,
  }: {
    productId: string;
  }): Promise<Partial<ProductDoc>> {
    const products = await this.repository.FindProductById({ productId });
    return FormatData(products);
  }

  async GetProductsByCategory({
    typeOfProduct,
  }: {
    typeOfProduct: string;
  }): Promise<Partial<ProductDoc[]>> {
    const products = await this.repository.FindProductByType({ typeOfProduct });
    return FormatData(products);
  }

  async GetProductPayload({
    userId,
    productInfo,
    eventType,
  }: {
    userId: string;
    productInfo: { productId: string; qty?: number };
    eventType: string;
  }): Promise<any> {
    const { productId, qty } = productInfo;
    const product = await this.repository.FindProductById({ productId });

    if (product) {
      const payload = {
        event: eventType,
        data: { userId, product, qty },
      };

      return FormatData(payload);
    } else {
      return FormatData({ error: "No product Available" });
    }
  }
}

export default ProductService;
