package es.angelkrasimirov.timeweaver.config.initializers;

import java.util.Set;
import java.util.Collections;

public interface DataInitializer {

  void initialize();

  String getName();

  void logStart();

  void logComplete();

  default Set<Class<? extends DataInitializer>> getDependencies() {
    return Collections.emptySet();
  }
}
