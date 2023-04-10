package com.sandra.springboot.backend.recetas.models.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;

// default package
// Generated 25 mar 2023 14:09:12 by Hibernate Tools 4.3.6.Final

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

/**
 * Usuario generated by hbm2java
 */
@Entity
@Table(name = "usuario")
public class Usuario implements java.io.Serializable {

	private static final long serialVersionUID = 1L;
	private int id;
	private String usuario;
	private String correo;
	private String password;
	private String imagen;
	private DatosUsuario datosUsuario;
	@JsonIgnoreProperties("usuario")
	private Set<Receta> recetas = new HashSet<Receta>(0);
	@JsonIgnoreProperties({"usuario", "usuarios"})
	private Set<Receta> recetas_seguidas = new HashSet<Receta>(0);

	public Usuario() {
	}

	public Usuario(int id, String usuario, String correo, String password) {
		this.id = id;
		this.usuario = usuario;
		this.correo = correo;
		this.password = password;
	}

	public Usuario(int id, String usuario, String correo, String password, String imagen, DatosUsuario datosUsuario,  Set<Receta> recetas,  Set<Receta> recetas_seguidas) {
		this.id = id;
		this.usuario = usuario;
		this.correo = correo;
		this.password = password;
		this.imagen = imagen;
		this.datosUsuario = datosUsuario;
		this.recetas = recetas;
		this.recetas_seguidas = recetas_seguidas;
	}

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

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) // Le da números consecutivos, un auto-numérico
	@Column(name = "id", unique = true, nullable = false)
	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Column(name = "usuario", nullable = false, length = 100)
	public String getUsuario() {
		return this.usuario;
	}

	public void setUsuario(String usuario) {
		this.usuario = usuario;
	}

	@Column(name = "correo", nullable = false, length = 150)
	public String getCorreo() {
		return this.correo;
	}

	public void setCorreo(String correo) {
		this.correo = correo;
	}

	@Column(name = "password", nullable = false, length = 100)
	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Column(name = "imagen")
	public String getImagen() {
		return this.imagen;
	}

	public void setImagen(String imagen) {
		this.imagen = imagen;
	}

	@OneToOne(fetch = FetchType.LAZY, mappedBy = "usuario", cascade = CascadeType.ALL)
	public DatosUsuario getDatosUsuario() {
		return this.datosUsuario;
	}

	public void setDatosUsuario(DatosUsuario datosUsuario) {
		this.datosUsuario = datosUsuario;
		if (datosUsuario != null) this.datosUsuario.setUsuario(this);
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "usuario")
	public Set<Receta> getRecetas() {
		return this.recetas;
	}

	public void setRecetas(Set<Receta> recetas) {
		this.recetas = recetas;
	}

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "recetas_seguidas_usuario", joinColumns = {
			@JoinColumn(name = "usuario", nullable = false, updatable = false) }, inverseJoinColumns = {
					@JoinColumn(name = "receta", nullable = false, updatable = false) })
	public Set<Receta> getRecetas_seguidas() {
		return this.recetas_seguidas;
	}

	public void setRecetas_seguidas(Set<Receta> recetas_seguidas) {
		this.recetas_seguidas = recetas_seguidas;
	}

}
