"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import usePost from "@/services/usePost";
export default function AddProductPage() {
  // Form data state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [stock, setStock] = useState("");
  const [lowStock, setLowStock] = useState("");
  const [weight, setWeight] = useState("");
  const [brand, setBrand] = useState("");
  const [vendor, setVendor] = useState("");
  const [productType, setProductType] = useState("");
  const [category, setCategory] = useState("");
  const { postData, loading, error } = usePost();
  const [images, setImages] = useState<File[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // To fetch the Catergories
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validation before submission
  if (!name || !description || !price || !stock) {
    alert("Please fill in all required fields");
    return;
  }

  const formData = new FormData();


  formData.append("name", name);
  formData.append("description", description);
  formData.append("short_description", shortDescription);
  formData.append("price", price);

  if (images.length === 0) {
    alert("Please upload at least one product image.");
    return;
  }
  
  // Only append if values exist
  if (comparePrice) formData.append("compare_price", comparePrice);
  formData.append("stock", stock);
  if (lowStock) formData.append("low_stock", lowStock);
  if (weight) formData.append("weight", weight);
  if (category) formData.append("category_id", category);
  if (brand) formData.append("brand", brand);
  if (vendor) formData.append("vendor", vendor);
  if (productType) formData.append("product_type", productType);
  
  // Boolean values as strings
  formData.append("is_active", isActive ? "1" : "0");
  formData.append("is_featured", isFeatured ? "1" : "0");

  // Append image
  if (images.length > 0) {
    formData.append("image", images[0]);
  }

  // Debug: Log form data
  console.log("Form data being sent:");
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    const res = await postData("products", formData);
    
    console.log("Full response:", res);

    // Check for different response structures
    if (res?.success === false) {
      console.error("Validation Errors:", res.errors);
      alert("Submission failed: " + JSON.stringify(res.errors, null, 2));
      return;
    }

    // Check if response indicates success
    if (res?.success === true || res?.id || res?.data) {
      console.log("Product submitted successfully:", res);
      alert("Product created successfully!");
      
      // Reset form
      setName("");
      setDescription("");
      setShortDescription("");
      setPrice("");
      setComparePrice("");
      setStock("");
      setLowStock("");
      setWeight("");
      setBrand("");
      setVendor("");
      setProductType("");
      setCategory("");
      setImages([]);
      setIsActive(true);
      setIsFeatured(false);
    } else {
      console.error("Unexpected response structure:", res);
      alert("Unexpected response from server. Check console for details.");
    }

  } catch (error) {
    console.error("Error creating product:", error);
    
    // More detailed error handling
    if (error.response) {
      console.error("Error response:", error.response.data);
      alert(`Server Error: ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      console.error("No response received:", error.request);
      alert("No response from server. Please check your connection.");
    } else {
      console.error("Request setup error:", error.message);
      alert(`Request Error: ${error.message}`);
    }
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Add New Product</h1>
            <p className="text-muted-foreground">
              Create a new product for your store
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter product name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter product description"
                      className="min-h-[120px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="short-description">Short Description</Label>
                    <Textarea
                      id="short-description"
                      placeholder="Brief product summary (optional)"
                      className="min-h-[80px]"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Product Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="space-y-2">
                        <Label htmlFor="images" className="cursor-pointer">
                          <span className="text-sm text-center font-medium text-blue-600 hover:text-blue-500">
                            Click to upload images
                          </span>
                          <Input
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            
                          />
                        </Label>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB each
                        </p>
                      </div>
                    </div>

                    {images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Product ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />

                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            {index === 0 && (
                              <Badge className="absolute bottom-1 left-1 text-xs">
                                Main
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="compare-price">Compare at Price</Label>
                      <Input
                        id="compare-price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={comparePrice}
                        onChange={(e) => setComparePrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="0"
                        required
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="low-stock">Low Stock Alert</Label>
                      <Input
                        id="low-stock"
                        type="number"
                        placeholder="5"
                        value={lowStock}
                        onChange={(e) => setLowStock(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Product Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="active">Active</Label>
                    <Switch
                      id="active"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Featured Product</Label>
                    <Switch
                      id="featured"
                      checked={isFeatured}
                      onCheckedChange={setIsFeatured}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Product Organization */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      placeholder="Product brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendor">Vendor</Label>
                    <Input
                      id="vendor"
                      placeholder="Product vendor"
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-type">Product Type</Label>
                    <Input
                      id="product-type"
                      placeholder="e.g., T-shirt, Phone, Book"
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit">Publish Product</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
