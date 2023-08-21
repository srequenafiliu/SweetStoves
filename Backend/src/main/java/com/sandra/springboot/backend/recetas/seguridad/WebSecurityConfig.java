package com.sandra.springboot.backend.recetas.seguridad;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
	
	 @Bean
	    protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	        return http.cors(withDefaults()).csrf(csrf -> csrf.disable())
	        		.authorizeHttpRequests(auth -> auth.requestMatchers("/**").permitAll().anyRequest().authenticated())
	        		.addFilterAfter(new JWTAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class)
                    .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).build();
	    }

}