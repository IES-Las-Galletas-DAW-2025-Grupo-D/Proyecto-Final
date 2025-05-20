package es.angelkrasimirov.timeweaver.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import es.angelkrasimirov.timeweaver.dtos.UserLoginDto;
import es.angelkrasimirov.timeweaver.dtos.UserRegistrationDto;
import es.angelkrasimirov.timeweaver.models.User;

@Mapper
public interface UserMapper {
  UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

  UserRegistrationDto toRegistrationDto(User user);

  User toEntity(UserRegistrationDto userDTO);

  UserLoginDto toLoginDto(User user);

  User toEntity(UserLoginDto userDTO);
}