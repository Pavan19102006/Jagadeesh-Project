package com.workstudy.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class KeepAliveService {

    private static final Logger logger = LoggerFactory.getLogger(KeepAliveService.class);
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${RENDER_EXTERNAL_URL:http://localhost:8080}")
    private String appUrl;

    // Run every 14 minutes (840000 ms) to keep Rent free tier awake
    // (Render spins down after 15 minutes of inactivity)
    @Scheduled(fixedRate = 840000)
    public void pingSelf() {
        try {
            String url = appUrl + "/api/jobs/active";
            logger.info("Keeping application alive - pinging: {}", url);
            restTemplate.getForObject(url, String.class);
        } catch (Exception e) {
            logger.warn("Keep-alive ping failed: {}", e.getMessage());
        }
    }
}
