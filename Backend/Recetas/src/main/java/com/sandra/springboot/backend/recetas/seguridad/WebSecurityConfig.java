package com.sandra.springboot.backend.recetas.seguridad;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
	
	 @Bean
	    protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	        return http.cors().and().csrf().disable()
	                .addFilterAfter(new JWTAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class)
	                .authorizeHttpRequests().requestMatchers("/**").permitAll().anyRequest().authenticated().and()
	                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().build();
	    }

}
