"use server";

import { db } from "@/lib/db";
import { products, productFeatures, productRequirements, purchases } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/logger";

async function uploadFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const uploadDir = join(process.cwd(), "public/uploads/products");
  await mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const path = join(uploadDir, filename);
  await writeFile(path, buffer);
  return `/uploads/products/${filename}`;
}

function generateSKU(name: string): string {
  const prefix = name.substring(0, 3).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}`;
}

export async function createProduct(formData: FormData) {
  const productId = crypto.randomUUID();
  const imageFile = formData.get("image_file") as File;
  const downloadFile = formData.get("download_file") as File;

  const imageUrl = await uploadFile(imageFile);
  const downloadUrlFromBrowse = await uploadFile(downloadFile);

  const name = formData.get("name") as string;
  const sku = (formData.get("sku") as string) || generateSKU(name);
  const MASTER_BUSINESS_ID = "00000000-0000-0000-0000-000000000001";

  await db.insert(products).values({
    id: productId,
    businessId: MASTER_BUSINESS_ID,
    sku: sku,
    name: name,
    description: formData.get("description") as string,
    price: formData.get("price") as string,
    promoPrice: formData.get("promoPrice") ? (formData.get("promoPrice") as string) : null,
    type: formData.get("type") as string,
    categoryId: (formData.get("categoryId") as string) || null,
    licenseId: (formData.get("licenseId") as string) || null,
    version: formData.get("version") as string,
    supportStatus: formData.get("supportStatus") as string,
    status: formData.get("status") as string || "LAUNCHED",
    releaseInfoId: formData.get("releaseInfoId") as string || null,
    releaseDate: formData.get("releaseDate") ? new Date(formData.get("releaseDate") as string) : new Date(),
    image: imageUrl || (formData.get("image") as string),
    youtubeUrl: formData.get("youtubeUrl") as string,
    downloadUrl: downloadUrlFromBrowse || (formData.get("downloadUrl") as string),
    isActive: true,
  });

  const features = formData.get("features_raw") as string;
  if (features) {
    const featureList = features.split(",").map(f => f.trim()).filter(Boolean);
    for (const fName of featureList) {
      await db.insert(productFeatures).values({
        id: crypto.randomUUID(),
        productId: productId,
        name: fName,
      });
    }
  }

  await db.insert(productRequirements).values({
    id: crypto.randomUUID(),
    productId: productId,
    os: formData.get("req_os") as string,
    ram: formData.get("req_ram") as string,
    storage: formData.get("req_storage") as string,
  });

  await logActivity({
    action: "MENAMBAH_PRODUK",
    entity: "Product",
    details: `Menambah produk baru: ${name} (SKU: ${sku})`
  });

  revalidatePath("/admin/products");
  revalidatePath("/marketplace");
  revalidatePath("/");
}

export async function updateProduct(id: string, formData: FormData) {
  const imageFile = formData.get("image_file") as File;
  const downloadFile = formData.get("download_file") as File;

  const imageUrl = await uploadFile(imageFile);
  const downloadUrlFromBrowse = await uploadFile(downloadFile);

  const updateData: any = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: formData.get("price") as string,
    promoPrice: formData.get("promoPrice") ? (formData.get("promoPrice") as string) : null,
    type: formData.get("type") as string,
    categoryId: (formData.get("categoryId") as string) || null,
    licenseId: (formData.get("licenseId") as string) || null,
    version: formData.get("version") as string,
    supportStatus: formData.get("supportStatus") as string,
    status: formData.get("status") as string,
    releaseInfoId: (formData.get("releaseInfoId") as string) || null,
    youtubeUrl: formData.get("youtubeUrl") as string,
    updatedAt: new Date(),
  };

  if (imageUrl) updateData.image = imageUrl;
  if (downloadUrlFromBrowse) updateData.downloadUrl = downloadUrlFromBrowse;
  if (formData.get("sku")) updateData.sku = formData.get("sku") as string;
  if (formData.get("releaseDate")) updateData.releaseDate = new Date(formData.get("releaseDate") as string);

  await db.update(products).set(updateData).where(eq(products.id, id));

  const features = formData.get("features_raw") as string;
  if (features !== null) {
    await db.delete(productFeatures).where(eq(productFeatures.productId, id));
    const featureList = features.split(",").map(f => f.trim()).filter(Boolean);
    for (const fName of featureList) {
      await db.insert(productFeatures).values({
        id: crypto.randomUUID(),
        productId: id,
        name: fName,
      });
    }
  }

  await db.delete(productRequirements).where(eq(productRequirements.productId, id));
  await db.insert(productRequirements).values({
    id: crypto.randomUUID(),
    productId: id,
    os: formData.get("req_os") as string,
    ram: formData.get("req_ram") as string,
    storage: formData.get("req_storage") as string,
  });

  await logActivity({
    action: "UPDATE_PRODUK",
    entity: "Product",
    details: `Mengubah data produk: ${updateData.name} (ID: ${id})`
  });

  revalidatePath("/admin/products");
  revalidatePath("/marketplace");
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  try {
    const product = await db.query.products.findFirst({ where: eq(products.id, id) });
    // Soft delete: Update deletedAt instead of physical delete
    await db.update(products).set({ deletedAt: new Date() }).where(eq(products.id, id));
    
    await logActivity({
      action: "HAPUS_PRODUK",
      entity: "Product",
      details: `Menghapus produk: ${product?.name || id} (Soft Delete)`
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Gagal menghapus produk. Terjadi kesalahan pada server." };
  }
}
