package com.sandra.springboot.backend.recetas.seguridad;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static org.springframework.security.config.Customizer.withDefaults;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
	
	 @Bean
	    protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	        http.cors(withDefaults()).csrf(csrf -> csrf.disable())
	                .addFilterAfter(new JWTAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class)
	                .authorizeHttpRequests(authorize -> {
	                	authorize.requestMatchers("/auth/login", "/auth/registro", "/images/**").permitAll();
	                	authorize.requestMatchers(HttpMethod.GET, "/recetas/**", "/usuarios").permitAll();
	                	authorize.anyRequest().authenticated();
	                	});
	        http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
	        return http.build();
	    }

	    @Bean
	    public CorsConfigurationSource corsConfigurationSource() {
	        final CorsConfiguration configuration = new CorsConfiguration();
	        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
	        configuration.setAllowCredentials(true);
	        configuration.setAllowedMethods(Arrays.asList("HEAD", "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
	        configuration.setAllowedHeaders(Arrays.asList("Access-Control-Allow-Headers", "Access-Control-Allow-Origin",
	                "Access-Control-Request-Method", "Access-Control-Request-Headers", "Origin", "Cache-Control",
	                "Content-Type", "Authorization"));
	        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	        source.registerCorsConfiguration("/**", configuration);
	        return source;
	    }

}