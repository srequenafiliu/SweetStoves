package com.sandra.springboot.backend.recetas.models.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginDto implements java.io.Serializable {

	private static final long serialVersionUID = 1L;
	
	@NonNull
	@NotBlank
	@Size(min = 4, message = "debe contener mínimo 4 caracteres")
	private String usuario;
	
	@NonNull
	private String password;
	
	public LoginDto(LoginDto u) {
		this.usuario = u.usuario;
		this.password = u.password;
	}

}