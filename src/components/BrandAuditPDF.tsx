import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { AuditResult, LighthouseData, FormData } from '@/types';

// Register fonts - using system fonts for better compatibility
Font.register({
  family: 'Helvetica',
  src: 'Helvetica',
});

Font.register({
  family: 'Helvetica-Bold',
  src: 'Helvetica-Bold',
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  
  // Header styles
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#21145f',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  date: {
    fontSize: 10,
    color: '#999999',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginVertical: 20,
  },

  // Section styles
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    backgroundColor: '#21145f',
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  sectionHeaderTan: {
    backgroundColor: '#eae1cd',
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
  sectionTitleTan: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#21145f',
    textAlign: 'center',
  },

  // Brand Health Dashboard
  dashboardContainer: {
    backgroundColor: '#21145f',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  dashboardLayout: {
    flexDirection: 'row',
    gap: 20,
  },
  gradeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
  },
  grade: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#b0943d',
    marginBottom: 8,
  },
  gradeLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: 'medium',
  },
  detailedScoresContainer: {
    flex: 2,
  },
  detailedScoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  detailedScoreCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    width: '48%',
    minWidth: 200,
  },
  scoreCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  scoreCardInfo: {
    flex: 1,
    marginRight: 12,
  },
  scoreCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  scoreCardDescription: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 1.3,
  },
  scoreCardValue: {
    alignItems: 'flex-end',
  },
  scoreCardNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  scoreCardLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  progressBarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#b0943d',
    borderRadius: 4,
  },
  overallHealthContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  overallHealthContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallHealthInfo: {
    flex: 1,
  },
  overallHealthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  overallHealthDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  overallHealthValue: {
    alignItems: 'flex-end',
  },
  overallHealthNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#b0943d',
    marginBottom: 2,
  },
  overallHealthLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },

  // Summary section
  summaryContainer: {
    backgroundColor: '#eae1cd',
    padding: 20,
    borderRadius: 12,
  },
  summaryContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 16,
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 12,
    color: 'rgba(33, 20, 95, 0.9)',
    lineHeight: 1.6,
    marginBottom: 8,
  },

  // ROI Forecast
  roiContainer: {
    backgroundColor: '#21145f',
    padding: 20,
    borderRadius: 12,
  },
  roiGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roiItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    width: '30%',
  },
  roiTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  roiText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 1.4,
  },

  // Technical Performance
  techContainer: {
    backgroundColor: '#eae1cd',
    padding: 20,
    borderRadius: 12,
  },
  techGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  techItem: {
    alignItems: 'center',
    marginBottom: 16,
    width: '25%',
  },
  techCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  techValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  techLabel: {
    fontSize: 12,
    color: '#21145f',
    textAlign: 'center',
    fontWeight: 'medium',
  },

  // Strengths and Weaknesses
  swGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  swColumn: {
    width: '48%',
  },
  swContainer: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  swContainerNavy: {
    backgroundColor: '#21145f',
  },
  swContainerPurple: {
    backgroundColor: '#923a80',
  },
  swTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  swItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  swItemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  swIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  swText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 1.4,
    flex: 1,
  },

  // Next Steps
  stepsContainer: {
    backgroundColor: '#21145f',
    padding: 20,
    borderRadius: 12,
  },
  stepItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  stepText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 1.5,
    flex: 1,
  },

  // Additional Suggestions
  suggestionsContainer: {
    backgroundColor: '#eae1cd',
    padding: 20,
    borderRadius: 12,
  },
  suggestionItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  suggestionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#b0943d',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  suggestionText: {
    fontSize: 11,
    color: 'rgba(33, 20, 95, 0.9)',
    lineHeight: 1.4,
    flex: 1,
  },

  // CTA Section
  ctaContainer: {
    backgroundColor: '#21145f',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 1.5,
    marginBottom: 16,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#999999',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    fontSize: 8,
    color: '#999999',
  },
});

// Helper function to get score color
const getScoreColor = (score: number) => {
  if (score >= 90) return '#10b981'; // green
  if (score >= 50) return '#f59e0b'; // yellow
  return '#ef4444'; // red
};

// Helper function to get score label
const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Work';
};

// Helper function to derive grade
const deriveGrade = (auditResult: AuditResult, lighthouseData?: LighthouseData | null): string | null => {
  if (auditResult.isMockData) return null;
  
  let score: number | null = null;

  // Prioritize Lighthouse data over pillar scores (matching web version)
  if (lighthouseData) {
    const { performance, accessibility, bestPractices, seo } = lighthouseData;
    score = Math.round((performance + accessibility + bestPractices + seo) / 4);
  } else if (auditResult.pillarScores) {
    const { branding, ux, conversion, content } = auditResult.pillarScores;
    score = Math.round((branding + ux + conversion + content) / 4);
  }

  if (score === null) return null;

  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

interface BrandAuditPDFProps {
  auditResult: AuditResult;
  userData: FormData;
  lighthouseData?: LighthouseData | null;
}

const BrandAuditPDF: React.FC<BrandAuditPDFProps> = ({
  auditResult,
  userData,
  lighthouseData,
}) => {
  const overallGrade = deriveGrade(auditResult, lighthouseData);
  const today = new Date().toLocaleDateString();

  return (
    <Document>
      {/* Page 1: Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Website Brand Audit is Ready</Text>
          <Text style={styles.subtitle}>
            Here is the comprehensive analysis for {userData.website}
          </Text>
          <Text style={styles.date}>Generated on: {today}</Text>
        </View>
        
        <View style={styles.divider} />

        {/* Brand Health Dashboard */}
        <View style={styles.section}>
          <View style={styles.dashboardContainer}>
            <Text style={styles.dashboardTitle}>Brand Health Dashboard</Text>
            
            {/* Grade + Detailed Scores Layout */}
            <View style={styles.dashboardLayout}>
              {overallGrade && (
                <View style={styles.gradeContainer}>
                  <Text style={styles.grade}>{overallGrade}</Text>
                  <Text style={styles.gradeLabel}>Overall Grade</Text>
                </View>
              )}
              
              {auditResult.pillarScores && (
                <View style={styles.detailedScoresContainer}>
                  <View style={styles.detailedScoresGrid}>
                    {/* Branding & Positioning */}
                    <View style={styles.detailedScoreCard}>
                      <View style={styles.scoreCardHeader}>
                        <View style={styles.scoreCardInfo}>
                          <Text style={styles.scoreCardTitle}>Branding & Positioning</Text>
                          <Text style={styles.scoreCardDescription}>Brand clarity, consistency, and voice</Text>
                        </View>
                        <View style={styles.scoreCardValue}>
                          <Text style={styles.scoreCardNumber}>{auditResult.pillarScores.branding}</Text>
                          <Text style={styles.scoreCardLabel}>{getScoreLabel(auditResult.pillarScores.branding)}</Text>
                        </View>
                      </View>
                      <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: `${auditResult.pillarScores.branding}%` }]} />
                      </View>
                    </View>

                    {/* User Experience */}
                    <View style={styles.detailedScoreCard}>
                      <View style={styles.scoreCardHeader}>
                        <View style={styles.scoreCardInfo}>
                          <Text style={styles.scoreCardTitle}>User Experience</Text>
                          <Text style={styles.scoreCardDescription}>Navigation, design, and usability</Text>
                        </View>
                        <View style={styles.scoreCardValue}>
                          <Text style={styles.scoreCardNumber}>{auditResult.pillarScores.ux}</Text>
                          <Text style={styles.scoreCardLabel}>{getScoreLabel(auditResult.pillarScores.ux)}</Text>
                        </View>
                      </View>
                      <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: `${auditResult.pillarScores.ux}%` }]} />
                      </View>
                    </View>

                    {/* Conversion & Trust */}
                    <View style={styles.detailedScoreCard}>
                      <View style={styles.scoreCardHeader}>
                        <View style={styles.scoreCardInfo}>
                          <Text style={styles.scoreCardTitle}>Conversion & Trust</Text>
                          <Text style={styles.scoreCardDescription}>Credibility, funnels, and value proposition</Text>
                        </View>
                        <View style={styles.scoreCardValue}>
                          <Text style={styles.scoreCardNumber}>{auditResult.pillarScores.conversion}</Text>
                          <Text style={styles.scoreCardLabel}>{getScoreLabel(auditResult.pillarScores.conversion)}</Text>
                        </View>
                      </View>
                      <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: `${auditResult.pillarScores.conversion}%` }]} />
                      </View>
                    </View>

                    {/* Content & SEO */}
                    <View style={styles.detailedScoreCard}>
                      <View style={styles.scoreCardHeader}>
                        <View style={styles.scoreCardInfo}>
                          <Text style={styles.scoreCardTitle}>Content & SEO</Text>
                          <Text style={styles.scoreCardDescription}>Relevance, optimization, and engagement</Text>
                        </View>
                        <View style={styles.scoreCardValue}>
                          <Text style={styles.scoreCardNumber}>{auditResult.pillarScores.content}</Text>
                          <Text style={styles.scoreCardLabel}>{getScoreLabel(auditResult.pillarScores.content)}</Text>
                        </View>
                      </View>
                      <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: `${auditResult.pillarScores.content}%` }]} />
                      </View>
                    </View>
                  </View>

                  {/* Overall Brand Health Score */}
                  <View style={styles.overallHealthContainer}>
                    <View style={styles.overallHealthContent}>
                      <View style={styles.overallHealthInfo}>
                        <Text style={styles.overallHealthTitle}>Overall Brand Health</Text>
                        <Text style={styles.overallHealthDescription}>Average score across all categories</Text>
                      </View>
                      <View style={styles.overallHealthValue}>
                        <Text style={styles.overallHealthNumber}>
                          {Math.round((auditResult.pillarScores.branding + auditResult.pillarScores.ux + auditResult.pillarScores.conversion + auditResult.pillarScores.content) / 4)}
                        </Text>
                        <Text style={styles.overallHealthLabel}>out of 100</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated by Website Brand Audit Tool
          </Text>
        </View>
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} />
      </Page>

      {/* Page 2: Audit Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.sectionHeaderTan}>
          <Text style={styles.sectionTitleTan}>Audit Summary</Text>
        </View>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryContent}>
            {auditResult.isMockData || !auditResult.summary ? (
              <Text style={styles.summaryText}>Temporarily unavailable</Text>
            ) : (
              auditResult.summary.split('. ').map((sentence, index) => (
                sentence.trim() && (
                  <Text key={index} style={styles.summaryText}>
                    {sentence.trim()}.
                  </Text>
                )
              ))
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated by Website Brand Audit Tool
          </Text>
        </View>
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} />
      </Page>

      {/* Page 3: ROI Forecast & Technical Performance */}
      {(lighthouseData) && (
        <Page size="A4" style={styles.page}>
          {/* ROI Forecast */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>ROI Forecast</Text>
            </View>
            <View style={styles.roiContainer}>
              <View style={styles.roiGrid}>
                <View style={styles.roiItem}>
                  <Text style={styles.roiTitle}>Performance Impact</Text>
                  <Text style={styles.roiText}>
                    Improving page speed and user experience could increase conversion rates by 15-25%.
                  </Text>
                </View>
                <View style={styles.roiItem}>
                  <Text style={styles.roiTitle}>SEO Potential</Text>
                  <Text style={styles.roiText}>
                    Optimizing content and technical SEO could improve search rankings and organic traffic.
                  </Text>
                </View>
                <View style={styles.roiItem}>
                  <Text style={styles.roiTitle}>Brand Growth</Text>
                  <Text style={styles.roiText}>
                    Enhanced branding and messaging could increase customer trust and brand recognition.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Technical Performance Metrics */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderTan}>
              <Text style={styles.sectionTitleTan}>Technical Performance Metrics</Text>
            </View>
            <View style={styles.techContainer}>
              <View style={styles.techGrid}>
                <View style={styles.techItem}>
                  <View style={[styles.techCircle, { backgroundColor: getScoreColor(lighthouseData.performance) }]}>
                    <Text style={styles.techValue}>{lighthouseData.performance}</Text>
                  </View>
                  <Text style={styles.techLabel}>Performance</Text>
                </View>
                <View style={styles.techItem}>
                  <View style={[styles.techCircle, { backgroundColor: getScoreColor(lighthouseData.accessibility) }]}>
                    <Text style={styles.techValue}>{lighthouseData.accessibility}</Text>
                  </View>
                  <Text style={styles.techLabel}>Accessibility</Text>
                </View>
                <View style={styles.techItem}>
                  <View style={[styles.techCircle, { backgroundColor: getScoreColor(lighthouseData.bestPractices) }]}>
                    <Text style={styles.techValue}>{lighthouseData.bestPractices}</Text>
                  </View>
                  <Text style={styles.techLabel}>Best Practices</Text>
                </View>
                <View style={styles.techItem}>
                  <View style={[styles.techCircle, { backgroundColor: getScoreColor(lighthouseData.seo) }]}>
                    <Text style={styles.techValue}>{lighthouseData.seo}</Text>
                  </View>
                  <Text style={styles.techLabel}>SEO</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Generated by Website Brand Audit Tool
            </Text>
          </View>
          
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} />
        </Page>
      )}

      {/* Page 4: Strengths and Weaknesses */}
      <Page size="A4" style={styles.page}>
        <View style={styles.swGrid}>
          {/* Strengths */}
          <View style={styles.swColumn}>
            <View style={[styles.swContainer, styles.swContainerNavy]}>
              <Text style={styles.swTitle}>What You&apos;re Doing Well</Text>
              {auditResult.isMockData || !auditResult.strengths || auditResult.strengths.length === 0 ? (
                <View style={styles.swItem}>
                  <Text style={styles.swText}>Temporarily unavailable</Text>
                </View>
              ) : (
                auditResult.strengths.map((strength, index) => (
                  <View key={index} style={styles.swItem}>
                    <View style={styles.swItemContent}>
                      <View style={styles.swIcon}>
                        <Text style={{ color: '#ffffff', fontSize: 8 }}>✓</Text>
                      </View>
                      <Text style={styles.swText}>{strength}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>

          {/* Weaknesses */}
          <View style={styles.swColumn}>
            <View style={[styles.swContainer, styles.swContainerPurple]}>
              <Text style={styles.swTitle}>Areas for Improvement</Text>
              {auditResult.isMockData || !auditResult.weaknesses || auditResult.weaknesses.length === 0 ? (
                <View style={styles.swItem}>
                  <Text style={styles.swText}>Temporarily unavailable</Text>
                </View>
              ) : (
                auditResult.weaknesses.map((weakness, index) => (
                  <View key={index} style={styles.swItem}>
                    <View style={styles.swItemContent}>
                      <View style={styles.swIcon}>
                        <Text style={{ color: '#ffffff', fontSize: 8 }}>×</Text>
                      </View>
                      <Text style={styles.swText}>{weakness}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated by Website Brand Audit Tool
          </Text>
        </View>
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} />
      </Page>

      {/* Page 5: Next Steps */}
      <Page size="A4" style={styles.page}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top 3 Recommended Next Steps</Text>
        </View>
        <View style={styles.stepsContainer}>
          {auditResult.isMockData || !auditResult.actionableSteps || auditResult.actionableSteps.length === 0 ? (
            <View style={styles.stepItem}>
              <Text style={styles.stepText}>Temporarily unavailable</Text>
            </View>
          ) : (
            auditResult.actionableSteps.slice(0, 3).map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepContent}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated by Website Brand Audit Tool
          </Text>
        </View>
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} />
      </Page>

      {/* Page 6: Additional Suggestions */}
      {auditResult.improvements && auditResult.improvements.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.sectionHeaderTan}>
            <Text style={styles.sectionTitleTan}>Additional Suggestions</Text>
          </View>
          <View style={styles.suggestionsContainer}>
            {auditResult.isMockData ? (
              <View style={styles.suggestionItem}>
                <Text style={styles.suggestionText}>Temporarily unavailable</Text>
              </View>
            ) : (
              auditResult.improvements.map((improvement, index) => (
                <View key={index} style={styles.suggestionItem}>
                  <View style={styles.suggestionContent}>
                    <View style={styles.suggestionIcon}>
                      <Text style={{ color: '#ffffff', fontSize: 10 }}>↑</Text>
                    </View>
                    <Text style={styles.suggestionText}>{improvement}</Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Generated by Website Brand Audit Tool
            </Text>
          </View>
          
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} />
        </Page>
      )}

      {/* Page 7: CTA */}
      <Page size="A4" style={styles.page}>
        <View style={styles.ctaContainer}>
          <Text style={styles.ctaTitle}>Ready to Elevate Your Brand?</Text>
          <Text style={styles.ctaText}>
            This audit is just the beginning. Book a strategy session with our team to dive deeper into your brand positioning, 
            create a comprehensive action plan, and transform your website into a powerful conversion machine.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated by Website Brand Audit Tool
          </Text>
        </View>
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} />
      </Page>
    </Document>
  );
};

export default BrandAuditPDF; 