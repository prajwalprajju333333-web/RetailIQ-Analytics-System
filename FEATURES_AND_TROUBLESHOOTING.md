# RetailIQ Analytics System - Features & Known Issues

## ✅ Working Features

### Authentication
- ✓ User registration and login
- ✓ JWT token-based authentication  
- ✓ Token validation on protected routes
- ✓ Profile endpoint

### Analytics (requires data upload first)
- ✓ RFM Analysis (/api/rfm) - Recency, Frequency, Monetary metrics
- ✓ Customer Clustering (/api/clusters) - K-means segmentation (4 clusters)
- ✓ Marketing Recommendations (/api/recommendations) - Strategy per segment
- ✓ Country Analysis (/api/country-analysis) - Geographic insights

### Frontend Pages (after login)
- ✓ Dashboard - Overview with charts
- ✓ Country Analysis - Revenue by country
- ✓ Segmentation - Cluster details and radar chart
- ✓ Recommendations - Marketing strategies per cluster
- ✓ Upload Data - CSV file upload

### Data State (as of now)
- ✓ 25,000 transactions in database
- ✓ 1,000 RFM records computed
- ✓ 1,000 customer cluster assignments  
- ✓ Ready for analysis

## 🔍 What to Check If Not Working

1. **If analytics pages show "No data":**
   - Ensure you're logged in
   - Check if transactions were uploaded
   - Try clicking the Refresh button on each page

2. **If login doesn't work:**
   - Create an account first via the Register page
   - Check email/password are correct

3. **If charts aren't rendering:**
   - Check browser console for JavaScript errors
   - Ensure backend is running on port 8000
   - Verify frontend can reach http://localhost:5173

4. **If upload page has issues:**
   - CSV file should have columns: customer_id, invoice_id, product_name, quantity, unit_price, total_amount, transaction_date, country
   - Date format should be YYYY-MM-DD or timestamp

## 🚀 Quick Start
1. Open http://localhost:5173 in browser
2. Register a new account
3. Login with those credentials
4. (Optional) Upload a CSV file via Upload Data page
5. Visit Dashboard to see analysis

