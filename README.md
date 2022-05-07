# Analysis of Google Play Store Applications

**Information Visualization (CS5764) Final Project <br> By 'Core Four'**

**Team Members:** Zhen Shen, Meng Qi, Mayur Dhepe, Ashish Bhat

- URL to the website: https://zeroshen.github.io/CS5764_Final_Project/
- URL to the video: https://drive.google.com/file/d/16aFV7Akm8dywHWwMb8eyyhuRibnRKNZ3/view?usp=sharing

## Project Description:
Provide insights to android application developers about the trends in the android market and help them in creating more influential or successful applications based on various factors like rating, reviews, number of installs, etc. The play store applications data has enormous potential to drive application-making businesses and companies to success. Actionable insights can be drawn for developers to work on and capture the android market!
## Project Structure:

- ```css/```:
  - ```style.css```: Main CSS file for the project used to format the contents of our web page
- ```data/```:
  - ```datacleanup.ipynb```: Notebook containing the data cleaning process
  - ```googleplaystore.csv```: Original dataset 1
  - ```googleplaystore_converted.csv```: Cleaned dataset 1
  - ```googleplaystore_user_reviews.csv```: Original dataset 2
  - ```googleplaystore_converted_withReviews.csv```: A combined dataset for dataset 1 and dataset 2(With reviews)
  - ```googleplaystore_user_reviews_cleaned.csv```: Cleaned dataset 2
  - ```word_counts_converted_v2.csv```: Cleaned dataset for frequent words
- ```js/```:
  - ```areachart.js```: Code for the area chart visualization **(Interactive)**
  - ```barChart.js```: Code for the bar chart visualization **(Interactive)**
  - ```boxPlot.js```: Code for the box plot visualization
  - ```helper.js```: Helper code for the voronoi treemap visualization
  - ```main.js```: Main javaScript file for loading the data and initializing all visualizations
  - ```packedBubbles.js```: Code for the packed bubbles visualization **(Interactive, innovative)**
  - ```pieChart.js```: Code for the first pie chart visualization 
  - ```pieChartI.js```: Code for the second pie chart visualization **(Interactive)**
  - ```voronoiTreemap.js```: Code for the voronoi treemap visualization **(Interactive, innovative)**
  - ```wordCloud.js```: Code for the word cloud visualization **(Interactive, innovative)**
- ```index.html```: Main HTML file for our web page
