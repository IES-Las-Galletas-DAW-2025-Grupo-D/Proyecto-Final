package es.angelkrasimirov.timeweaver.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.angelkrasimirov.timeweaver.models.Role;
import es.angelkrasimirov.timeweaver.repositories.RoleRepository;

@Service
public class RoleService {

	@Autowired
	private RoleRepository roleRepository;

	public Role getRoleByName(String name) {
		return roleRepository.findByName(name).orElse(null);
	}

}
