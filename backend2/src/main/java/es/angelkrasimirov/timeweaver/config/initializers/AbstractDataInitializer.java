package es.angelkrasimirov.timeweaver.config.initializers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Base class for data initializers that provides common functionality
 */
public abstract class AbstractDataInitializer implements DataInitializer {

  protected final Logger logger = LoggerFactory.getLogger(getClass());

  @Override
  public String getName() {
    return getClass().getSimpleName();
  }

  @Override
  public void logStart() {
    logger.info("Starting initialization: {}", getName());
  }

  @Override
  public void logComplete() {
    logger.info("Completed initialization: {}", getName());
  }
}