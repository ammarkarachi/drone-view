# Getting Started Drone View - [Demo](https://ammarkarachi.github.io/drone-view/)


The drone view Web App uses the following components:

- [Vite](https://vitejs.dev/) dev environment. 
- [React](https://reactjs.org/) for the UI.
- [Chakra UI](https://chakra-ui.com/) for the UI components
- [React Leaflet](https://react-leaflet.js.org/) for the maps.
- [Dexie](https://dexie.org/) for the indexed DB wrapper


Make sure you install the dependencies before proceeding
```bash
npm i
```


###Scripts

```bash
npm start
```
runs the app the app in development mode


```bash
npm run build
```
Builds the app and creates a distribution in the `/dist` folder under the root


```bash
npm run serve
```
Serves the app from the `/dist` folder

### Test Data
You can generate your own test data in the form of csv files using the python script in this [gist](https://gist.github.com/ammarkarachi/69c9c7759a855dbf4970e0b3c2cc61cb).

```python
# bounding box
p1 = [25.837377,-106.645646] # upper left corner
p2 = [36.500704,-93.508292] # lower right corner

# number of flights
number_of_flights = 10

# years
end_year = 2021

# file path to save the data to
file_name = './test-data.csv'
```

The following fields can be edited and csv file will be generated at the path provided by running `python3 random_path_generator.py`. The file randomly generates the following fields `Name`, `Generation`, `Date` and `Latitude`, `Longitude` 


