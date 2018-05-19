package hello;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.apache.tomcat.jdbc.pool.PoolProperties;

@Configuration
@EnableWebMvc
public class WebConfig extends WebMvcConfigurerAdapter{
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**");
    }

    @Bean
    public DataSource dataSource() {
        PoolProperties poolProperties = new PoolProperties();
        //poolProperties.setUrl("jdbc:mysql://luistoscano.cscsfbsagdzc.sa-east-1.rds.amazonaws.com:3306/crime_application");
        poolProperties.setUrl("jdbc:mysql://localhost:3306/crime_application");
        //poolProperties.setUsername("toscano");
        poolProperties.setUsername("root");
        poolProperties.setPassword("Sandsoftime12017!");
        poolProperties.setDriverClassName("com.mysql.jdbc.Driver");
        poolProperties.setJmxEnabled(true);
        poolProperties.setTestWhileIdle(false);
        poolProperties.setTestOnBorrow(true);
        poolProperties.setValidationQuery("SELECT 1");
        poolProperties.setTestOnReturn(false);
        poolProperties.setValidationInterval(30000);
        poolProperties.setTimeBetweenEvictionRunsMillis(30000);
        poolProperties.setMaxActive(200);
        poolProperties.setInitialSize(25);
        poolProperties.setMaxWait(1000);
        poolProperties.setRemoveAbandonedTimeout(60);
        poolProperties.setMinEvictableIdleTimeMillis(30000);
        poolProperties.setMinIdle(25);
        poolProperties.setMaxIdle(50);
        poolProperties.setLogAbandoned(true);
        poolProperties.setRemoveAbandoned(true);
        poolProperties.setJdbcInterceptors("org.apache.tomcat.jdbc.pool.interceptor.ConnectionState;"
                + "org.apache.tomcat.jdbc.pool.interceptor.StatementFinalizer");
        return new DataSource(poolProperties);
    }
}