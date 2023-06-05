package com.sandra.springboot.backend.recetas.models.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Getter @Setter
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "datos_usuario")
public class DatosUsuario implements java.io.Serializable {

	private static final long serialVersionUID = 1L;
	
	@GenericGenerator(name = "generator", strategy = "foreign", parameters = @Parameter(name = "property", value = "usuario"))
	@Id
	@GeneratedValue(generator = "generator")
	@Column(name = "id", unique = true, nullable = false)
	@JsonIgnore
	private int id;
	
	@NonNull
	@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@PrimaryKeyJoinColumn
	@JsonIgnore
	private Usuario usuario;
	
	@NonNull
	@Column(name = "nombre", nullable = false, length = 150)
	@NotBlank
	@Pattern(regexp = "^\\D+$", message = "no debe contener números")
	private String nombre;
	
	@Column(name = "apellido", length = 150)
	@Pattern(regexp = "^\\D+$", message = "no debe contener números")
	private String apellido;
	
	@Column(name = "telefono", length = 15)
	@Pattern(regexp = "\\d{9}", message = "debe ser un número con 9 dígitos")
	private String telefono;

	public DatosUsuario(Usuario usuario, String nombre, String apellido, String telefono) {
		this.usuario = usuario;
		this.nombre = nombre;
		this.apellido = apellido;
		this.telefono = telefono;
	}

}
