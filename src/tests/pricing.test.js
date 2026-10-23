import { describe, it, expect } from 'vitest'
import { getProductById, getUnitPrice } from '../../src/utils/pricing'

describe('getProductById', () => {
  // Arrange
  const catalog = [
    { uuid: 'burger-1', name: 'Classic Burger', price: 10 },
    { uuid: 'burger-2', name: 'Double Burger', price: 15 },
  ]
  
  it('returns the product when its ID exists', () => {
    // Act
    const result = getProductById('burger-1', catalog)

    // Assert
    expect(result).toEqual(catalog[0])
  });

  it("returns null with an empty identifier", () => {
    const result = getProductById('', catalog);

    expect(result).null
  });

  it("returns null with an identifier that isn't in the catalog", () => {
    const result = getProductById('burger-3', catalog);

    expect(result).null
  });
})

describe("getUnitPrice", () => {
    it("returns the product price when the ID exists", () => {
      const catalog = [
        { uuid: 'burger-1', name: 'Classic Burger', price: 10 },
        { uuid: 'burger-2', name: 'Double Burger', price: 15 },
      ]

      const result = getUnitPrice("burger-1", catalog);

      expect(result).toEqual(10);
    });

    it("returns null when the ID does not exist in the catalog", () => {
      const catalog = [
        { uuid: 'burger-1', name: 'Classic Burger', price: 10 },
        { uuid: 'burger-2', name: 'Double Burger', price: 15 },
      ]

      const result = getUnitPrice("burger-3", catalog);

      expect(result).null
    })
})