package com.sandra.springboot.backend.recetas.models.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuario")
public class Usuario implements java.io.Serializable {

	private static final long serialVersionUID = 1L;
	
	@NonNull
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) // Le da números consecutivos, un auto-numérico
	@Column(name = "id", unique = true, nullable = false)
	private Integer id;
	
	@NonNull
	@Column(name = "usuario", unique = true, nullable = false, length = 100)
	@NotBlank
	@Size(min = 4, message = "debe contener mínimo 4 caracteres")
	private String usuario;
	
	@NonNull
	@Column(name = "correo", unique = true, nullable = false, length = 150)
	@NotBlank
	@Email(message = "no contiene un correo electónico válido")
	private String correo;
	
	@NonNull
	@Column(name = "password", nullable = false, length = 100)
	private String password;
	
	@Column(name = "imagen")
	private String imagen;
	
	@OneToOne(fetch = FetchType.LAZY, mappedBy = "usuario", cascade = CascadeType.ALL)
	@Valid
	private DatosUsuario datosUsuario;
	
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "usuario", cascade = CascadeType.ALL)
	@JsonIgnoreProperties({"usuario","tipo","necesidades","ingredientes","elaboracion","dificultad","imagen","creacion","usuarios"})
	private Set<Receta> recetas = new HashSet<Receta>(0);
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "recetas_seguidas_usuario", joinColumns = {
			@JoinColumn(name = "usuario", nullable = false, updatable = false) }, inverseJoinColumns = {
					@JoinColumn(name = "receta", nullable = false, updatable = false) })
	@JsonIgnoreProperties({"usuario","tipo","necesidades","ingredientes","elaboracion","dificultad","imagen","creacion","usuarios"})
	private Set<Receta> recetas_seguidas = new HashSet<Receta>(0);
	
	public Usuario(Usuario u) {
		this.id = u.id;
		this.usuario = u.usuario;
		this.correo = u.correo;
		this.password = u.password;
		this.imagen = u.imagen;
		this.datosUsuario = u.datosUsuario;
		this.recetas = u.recetas;
		this.recetas_seguidas = u.recetas_seguidas;
	}

}
