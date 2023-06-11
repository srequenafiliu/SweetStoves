package com.sandra.springboot.backend.recetas.models.dto;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
public class UsuarioDto implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@NonNull
	@NotBlank
	private String usuario;
	
	@NonNull
	@NotBlank
	private String password;
	
	@NotBlank
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$", message = "no tiene el formato correcto")
	private String new_password;

}
