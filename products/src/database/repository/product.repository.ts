import { CreateProductInputType, ProductDoc } from "productType";
import ProductModel from "../models/products";

class ProductRepository {
  public async CreateProduct({
    name,
    desc,
    type,
    unit,
    price,
    available,
    suplier,
    banner,
  }: CreateProductInputType): Promise<Partial<ProductDoc>> {
    const product = new ProductModel({
      name,
      desc,
      type,
      unit,
      price,
      available,
      suplier,
      banner,
    });
    const newProduct = await product.save();
    return newProduct;
  }

  public async FindAllProducts(): Promise<Partial<ProductDoc[]>> {
    const products = await ProductModel.find();
    return products;
  }

  public async FindProductById({
    productId,
  }: {
    productId: string;
  }): Promise<Partial<ProductDoc>> {
    const product = await ProductModel.findById(productId);
    return product;
  }

  public async FindProductByType({
    typeOfProduct,
  }: {
    typeOfProduct: string;
  }): Promise<Partial<ProductDoc[]>> {
    const products = await ProductModel.find({ type: typeOfProduct });
    return products;
  }

  public async FindSelectedProduct({
    selectedIds,
  }: {
    selectedIds: string[];
  }): Promise<Partial<ProductDoc[]>> {
    const products = await ProductModel.find()
      .where("_id")
      .in(selectedIds.map((_id) => _id))
      .exec();
    return products;
  }
}

export default ProductRepository;
