import { Brand } from '../types/brand';
import { sampleBrand } from '../data/sampleBrand';
import { normalizeBrandData } from '../utils/migration';
import { ALL_MODULE_IDS, MODULE_REGISTRY } from '../modules/registry';

const STORAGE_KEY = 'brand_guidelines_system_brands_v3';
const ACTIVE_BRAND_ID_KEY = 'brand_guidelines_system_active_id';

export function loadBrands(): Brand[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed initial sample brand
      const initial = [normalizeBrandData(sampleBrand)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((b) => normalizeBrandData(b));
    }
    // Fallback if empty array
    const initial = [normalizeBrandData(sampleBrand)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch (err) {
    console.error('Failed to load brands from localStorage', err);
    return [normalizeBrandData(sampleBrand)];
  }
}

export function saveBrands(brands: Brand[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(brands));
  } catch (err) {
    console.error('Failed to save brands to localStorage', err);
  }
}

export function saveSingleBrand(updatedBrand: Brand): Brand[] {
  const brands = loadBrands();
  const index = brands.findIndex(b => b.id === updatedBrand.id);
  const now = new Date().toISOString();
  const brandToSave = { ...updatedBrand, updatedAt: now };

  let updatedList: Brand[];
  if (index >= 0) {
    updatedList = [...brands];
    updatedList[index] = brandToSave;
  } else {
    updatedList = [brandToSave, ...brands];
  }

  saveBrands(updatedList);
  return updatedList;
}

export function createNewBrand(name: string, description?: string): Brand {
  const id = 'brand-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
  const now = new Date().toISOString();

  // Initialize modules object with default empty data
  const defaultModulesData: any = {};
  ALL_MODULE_IDS.forEach(mId => {
    defaultModulesData[mId] = MODULE_REGISTRY[mId].defaultData();
  });

  // Set default brand name in overview module
  defaultModulesData.overview.brandName = name.trim();

  const newBrand: Brand = {
    id,
    name: name.trim() || 'Untitled Brand',
    description: description?.trim() || '',
    createdAt: now,
    updatedAt: now,
    activeModules: [...ALL_MODULE_IDS],
    modules: defaultModulesData
  };

  const currentBrands = loadBrands();
  saveBrands([newBrand, ...currentBrands]);
  saveActiveBrandId(newBrand.id);
  return newBrand;
}

export function deleteBrand(id: string): Brand[] {
  const currentBrands = loadBrands();
  const filtered = currentBrands.filter(b => b.id !== id);
  
  if (filtered.length === 0) {
    // Re-seed sample brand if all deleted
    const initial = [sampleBrand];
    saveBrands(initial);
    saveActiveBrandId(sampleBrand.id);
    return initial;
  }

  saveBrands(filtered);
  // Reset active brand if active was deleted
  const activeId = getActiveBrandId();
  if (activeId === id) {
    saveActiveBrandId(filtered[0].id);
  }
  return filtered;
}

export function getActiveBrandId(): string | null {
  return localStorage.getItem(ACTIVE_BRAND_ID_KEY);
}

export function saveActiveBrandId(id: string): void {
  localStorage.setItem(ACTIVE_BRAND_ID_KEY, id);
}
