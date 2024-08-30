package com.w.tokenw.dto;

import com.w.tokenw.model.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductDtoMapper {

    public ProductDto toDto(Product product) {
        return new ProductDto(
                product.getProductId(),
                product.getProductName(),
                product.getProductDescription(),
                product.getProductPrice(),
                product.getProductImage()
        );
    }

    public   Product toEntity(ProductDto productDto) {
        Product product = new Product();
        product.setProductId(productDto.getProductId());
        product.setProductName(productDto.getProductName());
        product.setProductDescription(productDto.getProductDescription());
        product.setProductPrice(productDto.getProductPrice());
        product.setProductImage(productDto.getProductImage());
        return product;
    }

    public void updateProductFromDto(ProductDto productDto, Product product) {
        if (productDto.getProductName() != null) {
            product.setProductName(productDto.getProductName());
        }
        if (productDto.getProductDescription() != null) {
            product.setProductDescription(productDto.getProductDescription());
        }
        if (productDto.getProductPrice() != null) {
            product.setProductPrice(productDto.getProductPrice());
        }
        if (productDto.getProductImage() != null) {
            product.setProductImage(productDto.getProductImage());
        }
    }
}

