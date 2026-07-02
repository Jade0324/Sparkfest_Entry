package com.sparkfest.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Integrates with your CorsConfig.java
            .cors(Customizer.withDefaults()) 
            
            // 2. Disables CSRF (necessary for REST APIs)
            .csrf(csrf -> csrf.disable())
            
            // 3. Allows all traffic to your API endpoints without a 403 Forbidden
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll() 
                .anyRequest().authenticated()
            );

        return http.build();
    }
}