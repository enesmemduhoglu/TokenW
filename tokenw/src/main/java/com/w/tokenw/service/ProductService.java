package com.w.tokenw.service;

import com.w.tokenw.dto.ProductDto;
import com.w.tokenw.dto.ProductDtoMapper;
import com.w.tokenw.exception.ApiRequestException;
import com.w.tokenw.model.Product;
import com.w.tokenw.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {


    private final ProductRepository productRepository;
    private final ProductDtoMapper productDtoMapper;

    public ProductService(ProductRepository productRepository, ProductDtoMapper productDtoMapper) {
        this.productRepository = productRepository;
        this.productDtoMapper = productDtoMapper;
    }

    public ProductDto createProduct(ProductDto productDto) {
        Product product = productDtoMapper.toEntity(productDto);
        Product savedProduct = productRepository.save(product);
        return productDtoMapper.toDto(savedProduct);
    }

    public List<ProductDto> getProducts() {
        return productRepository.findAll()
                .stream()
                .map(productDtoMapper::toDto)
                .collect(Collectors.toList());
    }

    public ProductDto updateProduct(Integer id, ProductDto productDto) {
        Optional<Product> existingProductOptional = productRepository.findById(id);

        if (existingProductOptional.isPresent()) {
            Product existingProduct = existingProductOptional.get();
            productDtoMapper.updateProductFromDto(productDto, existingProduct);
            Product updatedProduct = productRepository.save(existingProduct);

            return productDtoMapper.toDto(updatedProduct);
        } else {
            throw new ApiRequestException("Product not found with id: " + id);
        }
    }

    public void deleteProduct(Integer id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
        } else {
            throw new ApiRequestException("Product not found with id: " + id);
        }
    }

}
