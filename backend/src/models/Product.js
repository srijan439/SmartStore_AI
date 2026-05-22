import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ""
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: 80
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"]
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock must be a positive integer"],
      default: 0
    },
    image: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: ["Active", "Draft", "Archived", "Out of stock"],
      default: "Active"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

productSchema.index({ name: "text", description: "text", category: "text" });
productSchema.index({ status: 1, category: 1, createdAt: -1 });
productSchema.index({ stock: 1, updatedAt: -1 });

productSchema.methods.toClientJSON = function toClientJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    description: this.description,
    category: this.category,
    price: this.price,
    stock: this.stock,
    image: this.image,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
