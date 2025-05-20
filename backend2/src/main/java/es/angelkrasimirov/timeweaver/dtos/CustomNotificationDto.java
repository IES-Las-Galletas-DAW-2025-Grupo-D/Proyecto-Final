package es.angelkrasimirov.timeweaver.dtos;

import jakarta.validation.constraints.NotNull;

public class CustomNotificationDto {

  @NotNull(message = "Name is required")
  private String name;

  @NotNull(message = "Data is required")
  private String data;

  public CustomNotificationDto(String name, String data) {
    this.name = name;
    this.data = data;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getData() {
    return data;
  }

  public void setData(String data) {
    this.data = data;
  }

}
