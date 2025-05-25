package es.angelkrasimirov.timeweaver.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import es.angelkrasimirov.timeweaver.config.initializers.DataInitializer;

import java.util.*;

@Configuration
public class DataInitializerRunner {

  private final Map<Class<? extends DataInitializer>, DataInitializer> initializersByClass;
  private final Logger logger = LoggerFactory.getLogger(DataInitializerRunner.class);

  public DataInitializerRunner(List<DataInitializer> initializers) {
    this.initializersByClass = new HashMap<>();
    for (DataInitializer initializer : initializers) {
      initializersByClass.put(initializer.getClass(), initializer);
    }
  }

  @Bean
  ApplicationRunner initData() {
    return args -> {
      logger.info("Starting data initialization with {} initializers", initializersByClass.size());

      List<DataInitializer> sortedInitializers = sortInitializers();

      logger.info("Initializers execution order:");
      for (int i = 0; i < sortedInitializers.size(); i++) {
        DataInitializer initializer = sortedInitializers.get(i);
        logger.info("{}. {}", i + 1, initializer.getName());
      }

      for (DataInitializer initializer : sortedInitializers) {
        initializer.logStart();
        initializer.initialize();
        initializer.logComplete();
      }

      logger.info("Data initialization completed");
    };
  }

  private List<DataInitializer> sortInitializers() {
    Set<Class<? extends DataInitializer>> visited = new HashSet<>();
    Set<Class<? extends DataInitializer>> currentPath = new HashSet<>();
    List<DataInitializer> result = new ArrayList<>();

    for (Class<? extends DataInitializer> initializerClass : initializersByClass.keySet()) {
      if (!visited.contains(initializerClass) && !dfs(initializerClass, visited, currentPath, result)) {
        throw new IllegalStateException("Circular dependency detected during initialization sort.");
      }
    }

    return result;
  }

  private boolean dfs(
      Class<? extends DataInitializer> current,
      Set<Class<? extends DataInitializer>> visited,
      Set<Class<? extends DataInitializer>> currentPath,
      List<DataInitializer> result) {

    visited.add(current);
    currentPath.add(current);

    DataInitializer initializer = initializersByClass.get(current);
    if (initializer == null) {
      throw new IllegalStateException("Dependency on non-existent initializer: " + current.getName());
    }

    for (Class<? extends DataInitializer> dependencyClass : initializer.getDependencies()) {
      if (!initializersByClass.containsKey(dependencyClass)) {
        logger.error("Configuration error: Initializer '{}' depends on non-existent initializer '{}'",
            initializer.getName(), dependencyClass.getName());
        throw new IllegalStateException("Initializer '" + initializer.getName() +
            "' depends on non-existent initializer: " + dependencyClass.getName());
      }

      if (!visited.contains(dependencyClass)) {
        logger.trace("DFS recursing from {} to dependency {}", initializer.getName(), dependencyClass.getSimpleName());
        if (!dfs(dependencyClass, visited, currentPath, result)) {
          return false;
        }
      } else if (currentPath.contains(dependencyClass)) {
        logger.error(
            "Circular dependency detected: '{}' depends on '{}', which is already in the current recursion path.",
            initializer.getName(), dependencyClass.getSimpleName());
        logger.error("Current path: {}", currentPath.stream().map(Class::getSimpleName).toList());
        return false;
      }
    }

    currentPath.remove(current);
    result.add(initializer);
    logger.trace("DFS finished: {}", initializer.getName());

    return true;
  }
}
