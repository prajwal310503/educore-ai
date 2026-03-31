import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const instructors = [
  { name: 'Jane Smith',       email: 'jane.smith@educore.ai' },
  { name: 'Michael Chen',     email: 'michael.chen@educore.ai' },
  { name: 'Sarah Johnson',    email: 'sarah.johnson@educore.ai' },
  { name: 'David Kumar',      email: 'david.kumar@educore.ai' },
  { name: 'Emily Davis',      email: 'emily.davis@educore.ai' },
  { name: 'Carlos Rivera',    email: 'carlos.rivera@educore.ai' },
  { name: 'Priya Patel',      email: 'priya.patel@educore.ai' },
  { name: 'Alex Thompson',    email: 'alex.thompson@educore.ai' },
  { name: 'Yuki Tanaka',      email: 'yuki.tanaka@educore.ai' },
  { name: 'Fatima Al-Hassan', email: 'fatima.hassan@educore.ai' },
]

const students = [
  { name: 'Arjun Mehta',    email: 'arjun.mehta@student.ai' },
  { name: 'Sophie Laurent', email: 'sophie.laurent@student.ai' },
  { name: 'James Wilson',   email: 'james.wilson@student.ai' },
  { name: 'Ananya Reddy',   email: 'ananya.reddy@student.ai' },
  { name: 'Lucas Oliveira', email: 'lucas.oliveira@student.ai' },
  { name: 'Nina Petrov',    email: 'nina.petrov@student.ai' },
  { name: 'Omar Khalil',    email: 'omar.khalil@student.ai' },
  { name: 'Emma Zhang',     email: 'emma.zhang@student.ai' },
  { name: 'Ravi Shankar',   email: 'ravi.shankar@student.ai' },
  { name: 'Isabella Costa', email: 'isabella.costa@student.ai' },
]

const coursesData = [
  {
    title: 'Full-Stack Web Development with React & Node.js',
    description: 'Master modern full-stack development. Build production-ready apps with React, Node.js, Express, and MongoDB.',
    category: 'Web Development', level: 'INTERMEDIATE', price: 49.99, tags: ['react', 'nodejs', 'mongodb'],
    instructorIndex: 0,
    chapters: [
      {
        title: 'Introduction to Full-Stack Development',
        content: `LEARNING OBJECTIVES:
• Understand how client-server architecture works
• Learn the role of HTTP and REST APIs in web apps
• Get familiar with the modern JavaScript ecosystem

KEY CONCEPTS:

1. Client-Server Architecture
   The client (browser) sends requests; the server processes them and returns responses.
   Example: When you visit instagram.com, your browser (client) requests data from Instagram's servers, which return HTML, CSS, JS, and JSON data.

2. HTTP Methods
   GET    – Retrieve data (e.g., load a product page)
   POST   – Create new data (e.g., submit a form)
   PUT    – Replace existing data (e.g., update a profile)
   PATCH  – Partially update data (e.g., change only email)
   DELETE – Remove data (e.g., delete a post)

3. REST API Design
   Resources are identified by URLs: /api/users, /api/posts/:id
   Stateless: each request contains all needed information
   Example endpoint: GET /api/products?category=electronics returns all electronics products

4. The JavaScript Ecosystem
   Frontend: React, Vue, Angular
   Backend: Node.js + Express, NestJS
   Database: MongoDB (NoSQL), PostgreSQL (SQL)
   Tools: npm, Vite, ESLint, Prettier

SUMMARY:
Full-stack development means building both the user interface and the server logic. You'll use JavaScript/TypeScript on both ends, which simplifies learning and code sharing.

PRACTICE:
Draw a diagram showing how a login request flows from browser → server → database → response.`,
      },
      {
        title: 'React Fundamentals & Hooks',
        content: `LEARNING OBJECTIVES:
• Build reusable UI components with React
• Manage state with useState and side effects with useEffect
• Share data across components using Context API

KEY CONCEPTS:

1. Components & JSX
   Components are functions that return UI. JSX looks like HTML inside JavaScript.
   Example:
   function Greeting({ name }) {
     return <h1>Hello, {name}!</h1>
   }

2. useState – Managing Local State
   const [count, setCount] = useState(0)
   Clicking a button: setCount(count + 1) re-renders the component.
   Example: Shopping cart item counter, form input fields.

3. useEffect – Side Effects
   Runs after render. Used for API calls, subscriptions, timers.
   useEffect(() => {
     fetch('/api/user').then(r => r.json()).then(setUser)
   }, [userId])  // runs when userId changes

4. useContext – Global State
   Avoids "prop drilling" (passing props through many layers).
   Example: Theme toggle, logged-in user data available app-wide.

5. Custom Hooks
   Extract reusable logic: useFetch, useLocalStorage, useDebounce.
   function useFetch(url) {
     const [data, setData] = useState(null)
     useEffect(() => { fetch(url).then(r=>r.json()).then(setData) }, [url])
     return data
   }

SUMMARY:
React's component model + hooks make building complex UIs manageable. Components handle their own state; hooks let you reuse logic cleanly.

PRACTICE:
Build a Todo app: add items with useState, fetch initial todos from an API with useEffect.`,
      },
      {
        title: 'Node.js & Express Backend',
        content: `LEARNING OBJECTIVES:
• Build REST APIs with Express.js
• Use middleware for logging, auth, error handling
• Structure apps using MVC pattern

KEY CONCEPTS:

1. Node.js Event Loop
   Non-blocking I/O means Node handles thousands of connections simultaneously.
   Example: A single Node server can serve 10,000 users reading files at once without waiting.

2. Express Routing
   app.get('/users', (req, res) => res.json(users))
   app.post('/users', async (req, res) => {
     const user = await User.create(req.body)
     res.status(201).json(user)
   })

3. Middleware
   Functions that run between request and response.
   Examples:
   • express.json() – parses JSON bodies
   • morgan – request logging
   • cors() – allows cross-origin requests
   • authMiddleware – verifies JWT tokens

4. MVC Architecture
   Model: Database logic (User.js, Post.js)
   View: JSON responses (or templates)
   Controller: Request handlers (userController.js)
   Route: URL mapping (userRoutes.js)

5. Error Handling
   app.use((err, req, res, next) => {
     res.status(err.status || 500).json({ error: err.message })
   })

SUMMARY:
Express makes building APIs fast. Always separate concerns: routes → controllers → models. Use middleware for cross-cutting concerns like auth and logging.

PRACTICE:
Build a CRUD API for a blog: GET /posts, POST /posts, PUT /posts/:id, DELETE /posts/:id.`,
      },
      {
        title: 'MongoDB & Mongoose',
        content: `LEARNING OBJECTIVES:
• Design schemas for document-based data
• Perform CRUD operations with Mongoose
• Use relationships and aggregation pipelines

KEY CONCEPTS:

1. Document Model vs Relational
   MongoDB stores JSON-like documents. No fixed schema by default.
   Example: A User document can have different fields per record — flexible for evolving apps.

2. Mongoose Schema
   const userSchema = new Schema({
     name: { type: String, required: true },
     email: { type: String, unique: true },
     age: { type: Number, min: 0 }
   })

3. CRUD Operations
   Create: await User.create({ name: 'Alice', email: 'a@test.com' })
   Read:   await User.find({ age: { $gte: 18 } })
   Update: await User.findByIdAndUpdate(id, { name: 'Bob' }, { new: true })
   Delete: await User.findByIdAndDelete(id)

4. Relationships
   Embedding (nested): Good for one-to-few (user + addresses)
   Referencing: Good for one-to-many (user + posts)
   await Post.find({ author: userId }).populate('author', 'name email')

5. Aggregation Pipeline
   Powerful data transformation:
   db.orders.aggregate([
     { $match: { status: 'completed' } },
     { $group: { _id: '$userId', total: { $sum: '$amount' } } },
     { $sort: { total: -1 } }
   ])

SUMMARY:
MongoDB's flexible documents are great for rapidly evolving apps. Use embedding for related data queried together, referencing for large or shared data.

PRACTICE:
Design a schema for an e-commerce app: Products, Orders, Users with proper relationships.`,
      },
      {
        title: 'Authentication & Authorization',
        content: `LEARNING OBJECTIVES:
• Implement JWT-based authentication
• Hash passwords securely with bcrypt
• Build role-based access control (RBAC)

KEY CONCEPTS:

1. Password Hashing with bcrypt
   Never store plain passwords. bcrypt adds a salt and hashes:
   const hash = await bcrypt.hash(password, 10)  // 10 salt rounds
   const match = await bcrypt.compare(input, hash)  // returns true/false

2. JWT (JSON Web Tokens)
   Three parts: Header.Payload.Signature
   const token = jwt.sign({ userId, role }, process.env.SECRET, { expiresIn: '7d' })
   Client stores token in httpOnly cookie or localStorage.
   Each request sends: Authorization: Bearer <token>

3. Auth Middleware
   function authenticate(req, res, next) {
     const token = req.headers.authorization?.split(' ')[1]
     const decoded = jwt.verify(token, process.env.SECRET)
     req.user = decoded
     next()
   }

4. Role-Based Access Control
   function requireRole(role) {
     return (req, res, next) => {
       if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' })
       next()
     }
   }
   app.delete('/admin/users/:id', authenticate, requireRole('ADMIN'), deleteUser)

5. OAuth (Google/GitHub Login)
   Use Passport.js or NextAuth. Flow: redirect → provider login → callback → create session.

SUMMARY:
Auth is critical. Hash passwords, sign short-lived JWTs, validate on every request, restrict by role. Never trust client-side data.

PRACTICE:
Add auth to your blog API: register, login returns JWT, protect POST/DELETE routes.`,
      },
      {
        title: 'Deployment & CI/CD',
        content: `LEARNING OBJECTIVES:
• Containerize apps with Docker
• Deploy to Vercel and Railway
• Set up automated deployments with GitHub Actions

KEY CONCEPTS:

1. Docker Basics
   Dockerfile packages your app + dependencies into a portable container.
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json .
   RUN npm ci
   COPY . .
   CMD ["node", "server.js"]
   Run: docker build -t myapp . && docker run -p 3000:3000 myapp

2. Environment Variables
   Never hardcode secrets. Use .env files locally, platform secrets in production.
   DATABASE_URL, JWT_SECRET, API_KEYS — all injected at runtime.

3. Vercel Deployment (Frontend/Full-stack)
   Push to GitHub → Vercel auto-deploys on every commit.
   Zero config for Next.js. Preview URLs for every PR.

4. Railway (Backend/Database)
   Deploy Node.js APIs and PostgreSQL/MongoDB with one click.
   Automatic SSL, custom domains, environment variables dashboard.

5. GitHub Actions CI/CD
   name: Deploy
   on: [push]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - run: npm ci && npm test
     deploy:
       needs: test
       runs-on: ubuntu-latest
       steps:
         - run: vercel --prod --token=\${{ secrets.VERCEL_TOKEN }}

SUMMARY:
Modern deployment: code → GitHub → CI runs tests → auto-deploy to production. Docker ensures your app runs the same everywhere.

PRACTICE:
Deploy your blog API to Railway and frontend to Vercel with a GitHub Actions pipeline.`,
      },
    ],
    quiz: {
      title: 'Full-Stack Fundamentals Quiz',
      questions: [
        { text: 'Which hook is used for side effects in React?', options: ['useState', 'useEffect', 'useRef', 'useMemo'], correctAnswer: 1 },
        { text: 'What does REST stand for?', options: ['Remote Execution State Transfer', 'Representational State Transfer', 'Request and State Transfer', 'Resource State Technology'], correctAnswer: 1 },
        { text: 'Which MongoDB method finds all documents?', options: ['find()', 'getAll()', 'select()', 'fetch()'], correctAnswer: 0 },
        { text: 'What is JWT used for?', options: ['Database queries', 'Authentication tokens', 'CSS styling', 'Image compression'], correctAnswer: 1 },
      ],
    },
  },
  {
    title: 'Python for Data Science & Machine Learning',
    description: 'Learn Python, NumPy, Pandas, Matplotlib, and Scikit-learn. Build real machine learning models and analyze large datasets.',
    category: 'Data Science', level: 'BEGINNER', price: 39.99, tags: ['python', 'pandas', 'scikit-learn'],
    instructorIndex: 1,
    chapters: [
      {
        title: 'Python Basics & Data Types',
        content: `LEARNING OBJECTIVES:
• Write Python programs using variables, loops, and functions
• Understand Python's core data types
• Apply OOP concepts with classes

KEY CONCEPTS:

1. Core Data Types
   int, float, str, bool, list, tuple, dict, set
   Example:
   name = "Alice"          # str
   scores = [95, 87, 92]   # list (mutable)
   coords = (10.5, 20.3)   # tuple (immutable)
   profile = {"age": 25}   # dict

2. Control Flow
   for score in scores:
       if score >= 90:
           print("A grade")
       elif score >= 80:
           print("B grade")

3. Functions
   def calculate_average(numbers):
       return sum(numbers) / len(numbers)

   # Lambda (anonymous function)
   double = lambda x: x * 2

4. List Comprehensions
   squares = [x**2 for x in range(10)]
   evens   = [x for x in range(20) if x % 2 == 0]
   # Much faster and more Pythonic than loops

5. Classes & OOP
   class Student:
       def __init__(self, name, grade):
           self.name = name
           self.grade = grade
       def is_passing(self):
           return self.grade >= 60

SUMMARY:
Python's clean syntax makes it ideal for data science. Master list comprehensions and dict operations — they appear constantly in data workflows.

PRACTICE:
Write a function that takes a list of student scores, filters passing grades (≥60), and returns the average of passing students.`,
      },
      {
        title: 'NumPy for Numerical Computing',
        content: `LEARNING OBJECTIVES:
• Create and manipulate NumPy arrays
• Use broadcasting for efficient computation
• Apply linear algebra operations

KEY CONCEPTS:

1. Arrays vs Python Lists
   NumPy arrays are 100x faster for numerical operations.
   import numpy as np
   arr = np.array([1, 2, 3, 4, 5])
   matrix = np.zeros((3, 3))   # 3x3 matrix of zeros

2. Array Operations (Vectorized)
   a = np.array([1, 2, 3])
   b = np.array([4, 5, 6])
   a + b     # [5, 7, 9]  — no loop needed!
   a * 2     # [2, 4, 6]
   a.mean()  # 2.0
   a.std()   # standard deviation

3. Broadcasting
   Automatically expands shapes for operations:
   matrix = np.ones((3, 3))
   matrix + np.array([1, 2, 3])  # adds [1,2,3] to each row

4. Indexing & Slicing
   arr[2]        # element at index 2
   arr[1:4]      # elements 1, 2, 3
   matrix[0, :]  # first row
   arr[arr > 3]  # boolean indexing: [4, 5]

5. Useful Functions
   np.linspace(0, 1, 100)  # 100 evenly spaced points
   np.random.randn(1000)   # 1000 random normal values
   np.dot(A, B)            # matrix multiplication

SUMMARY:
NumPy is the foundation of all Python data science. Its vectorized operations eliminate slow Python loops. Every ML library (Pandas, Scikit-learn, TensorFlow) is built on top of NumPy.

PRACTICE:
Create a 5x5 matrix of random numbers. Find the row-wise mean, normalize each value (subtract mean, divide by std).`,
      },
      {
        title: 'Data Wrangling with Pandas',
        content: `LEARNING OBJECTIVES:
• Load and explore datasets with DataFrames
• Clean messy data: nulls, duplicates, types
• Aggregate and reshape data with groupby and pivot

KEY CONCEPTS:

1. Loading Data
   import pandas as pd
   df = pd.read_csv('sales.csv')
   df.head()    # first 5 rows
   df.info()    # column types and null counts
   df.describe()  # statistics: mean, std, min, max

2. Selecting Data
   df['price']           # single column (Series)
   df[['name', 'price']] # multiple columns
   df[df['price'] > 100] # filter rows
   df.loc[0:5, 'name':'price']  # label-based slicing

3. Handling Missing Data
   df.isnull().sum()          # count nulls per column
   df.dropna()                # drop rows with any null
   df['age'].fillna(df['age'].mean())  # fill with mean

4. GroupBy & Aggregation
   # Average sales by region:
   df.groupby('region')['sales'].mean()

   # Multiple aggregations:
   df.groupby('category').agg({'sales': 'sum', 'quantity': 'mean'})

5. Merging DataFrames
   # Like SQL JOIN:
   merged = pd.merge(orders, customers, on='customer_id', how='left')

SUMMARY:
Real-world data is messy. Pandas lets you load, inspect, clean, and transform data efficiently. The groupby + agg pattern is used in virtually every analysis.

PRACTICE:
Load a CSV of sales data. Find the top 5 products by total revenue. Show monthly sales trend.`,
      },
      {
        title: 'Data Visualization',
        content: `LEARNING OBJECTIVES:
• Create charts with Matplotlib and Seaborn
• Choose the right chart for each data type
• Build dashboards for exploratory analysis

KEY CONCEPTS:

1. Matplotlib Basics
   import matplotlib.pyplot as plt
   plt.plot([1,2,3], [4,5,6], color='blue', linewidth=2)
   plt.title('Sales Over Time')
   plt.xlabel('Month')
   plt.ylabel('Revenue ($)')
   plt.show()

2. Chart Types & When to Use Them
   Line chart    → trends over time (stock prices, monthly revenue)
   Bar chart     → comparing categories (sales by region)
   Histogram     → distribution of values (age distribution)
   Scatter plot  → relationship between two variables (price vs rating)
   Heatmap       → correlation matrix, frequency tables

3. Seaborn — Statistical Visualization
   import seaborn as sns
   sns.histplot(df['age'], bins=20, kde=True)
   sns.scatterplot(x='sqft', y='price', hue='bedrooms', data=df)
   sns.heatmap(df.corr(), annot=True, cmap='coolwarm')

4. Subplots
   fig, axes = plt.subplots(2, 2, figsize=(12, 8))
   axes[0,0].plot(x, y1)
   axes[0,1].bar(categories, values)
   plt.tight_layout()

5. Saving Charts
   plt.savefig('chart.png', dpi=150, bbox_inches='tight')

SUMMARY:
Good visualization reveals patterns invisible in raw numbers. Always label axes, use color purposefully, and choose chart type based on your data's story.

PRACTICE:
Visualize the Titanic dataset: survival rate by class (bar), age distribution (histogram), fare vs age (scatter).`,
      },
      {
        title: 'Machine Learning with Scikit-learn',
        content: `LEARNING OBJECTIVES:
• Train and evaluate classification and regression models
• Apply cross-validation to prevent overfitting
• Use pipelines for clean ML workflows

KEY CONCEPTS:

1. The ML Workflow
   1. Load data → 2. Explore & clean → 3. Feature engineering
   4. Split train/test → 5. Train model → 6. Evaluate → 7. Deploy

2. Train/Test Split
   from sklearn.model_selection import train_test_split
   X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
   Always split BEFORE any fitting to prevent data leakage.

3. Training Models
   from sklearn.ensemble import RandomForestClassifier
   model = RandomForestClassifier(n_estimators=100)
   model.fit(X_train, y_train)
   predictions = model.predict(X_test)

4. Evaluation Metrics
   Classification: accuracy, precision, recall, F1-score, ROC-AUC
   Regression: MAE, RMSE, R² score
   from sklearn.metrics import classification_report
   print(classification_report(y_test, predictions))

5. Cross-Validation
   from sklearn.model_selection import cross_val_score
   scores = cross_val_score(model, X, y, cv=5)
   print(f"Accuracy: {scores.mean():.2f} ± {scores.std():.2f}")
   5-fold CV is standard. Prevents overfitting on a lucky train/test split.

6. Pipelines
   from sklearn.pipeline import Pipeline
   pipe = Pipeline([('scaler', StandardScaler()), ('clf', LogisticRegression())])
   pipe.fit(X_train, y_train)  # scaler and model trained together

SUMMARY:
Scikit-learn's consistent API (fit, predict, score) works across all algorithms. Always use pipelines to prevent data leakage and cross-validation to get reliable estimates.

PRACTICE:
Predict house prices using the Boston dataset. Compare Linear Regression vs Random Forest. Report RMSE for both.`,
      },
      {
        title: 'Project: Predictive Analytics',
        content: `LEARNING OBJECTIVES:
• Apply the complete data science workflow end-to-end
• Engineer features and handle real-world messy data
• Present findings with visualizations and metrics

PROJECT: Predicting House Prices

STEP 1 — Data Loading & Exploration
   df = pd.read_csv('housing.csv')
   df.info()        # check dtypes and nulls
   df.describe()    # statistical overview
   Key insight: 'price' is right-skewed → log-transform helps linear models

STEP 2 — Data Cleaning
   Missing values: impute median for numeric, mode for categorical
   Outliers: cap at 99th percentile or use robust scalers
   Duplicates: df.drop_duplicates(inplace=True)

STEP 3 — Feature Engineering
   df['price_per_sqft'] = df['price'] / df['sqft']
   df['house_age'] = 2024 - df['year_built']
   pd.get_dummies(df, columns=['neighborhood'])  # encode categorical

STEP 4 — Modeling
   Models to try: Linear Regression, Random Forest, Gradient Boosting
   Use GridSearchCV for hyperparameter tuning:
   params = {'n_estimators': [100, 200], 'max_depth': [5, 10]}
   grid = GridSearchCV(RandomForestRegressor(), params, cv=5)

STEP 5 — Evaluation & Insights
   Plot feature importance: which features drive price most?
   Residual plot: are errors random or show patterns?
   Report: R²=0.87, RMSE=$24,500 means 87% of variance explained

STEP 6 — Presentation
   Create a Jupyter notebook with markdown explanations
   Show before/after visualizations
   Include a section on model limitations and next steps

SUMMARY:
Real data science is 80% cleaning and feature engineering, 20% modeling. The best model isn't the most complex — it's the one that generalizes well and is explainable to stakeholders.`,
      },
    ],
    quiz: {
      title: 'Python & Data Science Quiz',
      questions: [
        { text: 'Which library is used for numerical computing in Python?', options: ['Pandas', 'NumPy', 'Matplotlib', 'Flask'], correctAnswer: 1 },
        { text: 'What is a DataFrame?', options: ['A Python function', '2D labeled data structure', 'A neural network', 'A database table'], correctAnswer: 1 },
        { text: 'Which method drops null values in Pandas?', options: ['dropna()', 'fillna()', 'isnull()', 'notnull()'], correctAnswer: 0 },
        { text: 'What does cross-validation help prevent?', options: ['Slow training', 'Overfitting', 'Data leakage', 'Memory errors'], correctAnswer: 1 },
      ],
    },
  },
  {
    title: 'UI/UX Design Mastery',
    description: 'From wireframes to high-fidelity prototypes. Master Figma, design systems, user research, and accessibility.',
    category: 'Design', level: 'BEGINNER', price: 0, tags: ['figma', 'ux', 'design-systems'],
    instructorIndex: 2,
    chapters: [
      {
        title: 'Design Thinking & User Research',
        content: `LEARNING OBJECTIVES:
• Apply the 5-stage Design Thinking framework
• Conduct user interviews and create personas
• Map user journeys to identify pain points

KEY CONCEPTS:

1. Design Thinking Framework (5 Stages)
   1. Empathize  → Understand users (interviews, observation)
   2. Define     → Craft a problem statement ("HMW" questions)
   3. Ideate     → Brainstorm solutions (no judgment)
   4. Prototype  → Build quick, cheap versions
   5. Test       → Validate with real users, iterate

2. User Interviews
   Goal: understand behavior, not collect opinions.
   Good question: "Walk me through the last time you booked a flight."
   Bad question: "Would you use this feature?" (leading)
   Always ask: "Why?" and "Tell me more about that."

3. User Personas
   Fictional but research-based character:
   Name: Priya, 28, Product Manager
   Goals: Book travel quickly, avoid hidden fees
   Frustrations: Too many steps, confusing pricing
   Behaviors: Uses phone 80% of the time, comparison shops

4. Empathy Mapping
   Four quadrants: Says / Thinks / Does / Feels
   Example for a banking app user:
   Says: "I just want to check my balance fast"
   Thinks: "Is this secure?"
   Does: Opens app 3x daily
   Feels: Anxious about security

5. Journey Mapping
   Visualize the full experience: Awareness → Consideration → Purchase → Support
   Identify moments of delight and moments of frustration

SUMMARY:
Design without research is guessing. Spend 20% of project time understanding users — it prevents costly redesigns later. The best designers are the best listeners.

PRACTICE:
Interview 3 people about their experience ordering food online. Create a persona and map their journey.`,
      },
      {
        title: 'Wireframing & Information Architecture',
        content: `LEARNING OBJECTIVES:
• Create low and mid-fidelity wireframes
• Design clear information architecture and site maps
• Build user flows for key tasks

KEY CONCEPTS:

1. Information Architecture (IA)
   Organize content so users find things intuitively.
   Principles: categorize by user mental models, not company structure.
   Example: Users look for "Return Policy" under "Help", not "Legal".
   Tools: card sorting (have users group content), tree testing.

2. Site Maps
   Visual hierarchy of all pages/screens:
   Home → Products → [Category] → [Product Detail] → Cart → Checkout
   Every page should be reachable in 3 clicks from the homepage.

3. User Flows
   Step-by-step diagram of completing a task:
   [Landing Page] → [Sign Up] → [Verify Email] → [Onboarding] → [Dashboard]
   Include decision points: what if the user forgets their password?

4. Low-Fidelity Wireframes
   Black & white boxes and lines. No colors, no real text.
   Purpose: validate layout and structure before any design work.
   Tools: pen & paper, Balsamiq, or Figma with basic shapes.

5. Mid-Fidelity Wireframes
   Add real labels, navigation, button names. Still grayscale.
   Ready for user testing to validate navigation logic.

SUMMARY:
Wireframes cost nothing to change; finished designs cost everything. Validate structure and flow before adding visual design. IA decisions have more impact on UX than visual design.

PRACTICE:
Design the IA for an e-learning platform. Create a sitemap, then wireframe the course catalog page and checkout flow.`,
      },
      {
        title: 'Figma Fundamentals',
        content: `LEARNING OBJECTIVES:
• Master Figma's core tools: frames, auto layout, components
• Build reusable design systems with variants
• Collaborate with developers using inspect mode

KEY CONCEPTS:

1. Frames & Layout Grids
   Frames are the foundation (equivalent to artboards in other tools).
   Use layout grids (8pt grid system) to keep spacing consistent.
   Common frame sizes: 1440px (desktop), 375px (iPhone 14 Pro)

2. Auto Layout
   Makes designs responsive and spacing automatic.
   Select objects → Shift+A to add auto layout
   Set padding, gap, direction (horizontal/vertical)
   Example: A button automatically resizes when you change the label text.

3. Components & Instances
   Create a component (Ctrl+Alt+K) → reuse as instances everywhere.
   Change the master → all instances update automatically.
   Example: Update your primary button color once → updates everywhere.

4. Variants
   Organize component states in one place:
   Button variants: Primary/Secondary/Destructive × Default/Hover/Disabled
   Use "=" in property names: Type=Primary, State=Hover

5. Design Systems
   Styles: define colors, text styles, effects once.
   Components: buttons, inputs, cards, modals, navigation.
   Example: Google's Material Design, Airbnb's DLS.

6. Developer Handoff
   Inspect panel shows CSS values, spacing, colors automatically.
   Export assets, share component documentation.

SUMMARY:
Figma's component + auto layout system makes large-scale design manageable. Build your design system first — it's the investment that pays off on every screen you design.

PRACTICE:
Build a design system for a fintech app: define 8 colors, 5 text styles, and 10 components (buttons, inputs, cards).`,
      },
      {
        title: 'Visual Design Principles',
        content: `LEARNING OBJECTIVES:
• Apply typography, color, and spacing principles
• Use Gestalt principles for intuitive layouts
• Design accessible interfaces (WCAG compliance)

KEY CONCEPTS:

1. Typography
   Font pairing: one serif + one sans-serif, or two contrasting sans-serifs.
   Type hierarchy: H1 (32px bold) > H2 (24px semibold) > Body (16px regular) > Caption (12px)
   Line height: 1.5× for body text (16px font = 24px line height)
   Example: Figma UI uses Inter — clean, highly legible at small sizes.

2. Color Theory
   60-30-10 rule: 60% neutral, 30% brand color, 10% accent
   Always test: accessible contrast ratio ≥ 4.5:1 for body text (WCAG AA)
   Semantic colors: green=success, red=error, yellow=warning, blue=info

3. Spacing (8pt Grid)
   Use multiples of 8: 8, 16, 24, 32, 48, 64px
   Consistent spacing creates visual rhythm.
   More space = more importance (white space is not wasted space)

4. Gestalt Principles
   Proximity: items close together appear related
   Similarity: items that look alike seem related
   Continuation: the eye follows lines and curves
   Closure: we complete incomplete shapes in our mind
   Figure-ground: distinguishing an object from its background

5. Accessibility
   Color is never the only indicator (use icons + text too)
   Touch targets ≥ 44×44px on mobile
   Always provide alt text for images

SUMMARY:
Good visual design is invisible — users don't notice it; they just find things easily. Master the 8pt grid and consistent color/type systems before exploring creativity.

PRACTICE:
Redesign a cluttered website screenshot using the 8pt grid, a 3-color palette, and clear type hierarchy.`,
      },
      {
        title: 'Interaction Design & Prototyping',
        content: `LEARNING OBJECTIVES:
• Design meaningful micro-interactions and animations
• Build clickable prototypes in Figma
• Conduct usability tests and iterate

KEY CONCEPTS:

1. Micro-interactions
   Small animations that give feedback and delight users.
   Examples:
   • Button press: slight scale down (0.95) + color darken
   • Form error: shake animation + red border
   • Like button: heart explodes with particles
   • Pull-to-refresh: loading spinner appears

2. Animation Principles (12 from Disney)
   Key ones for UI: Ease in/out, Anticipation, Follow-through
   Duration: 200-300ms for most UI transitions (fast but perceptible)
   Never animate for the sake of it — every animation should communicate something

3. Figma Prototyping
   Connect frames with interactions:
   Trigger: On Click, On Hover, On Drag
   Animation: Instant, Dissolve, Smart Animate, Push, Slide
   Smart Animate automatically animates between matching layers.

4. Usability Testing
   5 users reveal 85% of usability problems (Nielsen's Law).
   Give tasks, not instructions: "Book a flight to Paris" not "Click the search button"
   Record screen + audio. Look for: hesitations, errors, confusion.

5. Iteration Process
   Test → Find top 3 issues → Fix → Re-test
   Document changes: "Changed CTA from 'Submit' to 'Book Now' — 40% increase in clicks"

SUMMARY:
Interaction design is the bridge between static screens and living products. Prototype early, test with real users, and treat every usability finding as a gift — it means you shipped less broken code.

PRACTICE:
Prototype a 5-screen onboarding flow. Test with 3 people. Write up the top 2 issues and your proposed fixes.`,
      },
    ],
    quiz: {
      title: 'UI/UX Design Quiz',
      questions: [
        { text: 'What is the first step in Design Thinking?', options: ['Prototype', 'Test', 'Empathize', 'Define'], correctAnswer: 2 },
        { text: 'What does UX stand for?', options: ['User Experience', 'Universal XML', 'Unique Extension', 'User Execution'], correctAnswer: 0 },
        { text: 'Which tool is most popular for UI design?', options: ['Photoshop', 'Figma', 'Illustrator', 'InDesign'], correctAnswer: 1 },
        { text: 'What is a design system?', options: ['A collection of reusable components', 'A database schema', 'A programming language', 'A testing framework'], correctAnswer: 0 },
      ],
    },
  },
  {
    title: 'Digital Marketing & SEO Strategy',
    description: 'Drive real business growth with data-driven marketing. Master SEO, Google Ads, social media, email campaigns, and analytics.',
    category: 'Marketing', level: 'INTERMEDIATE', price: 44.99, tags: ['seo', 'google-ads', 'analytics'],
    instructorIndex: 3,
    chapters: [
      {
        title: 'Digital Marketing Foundations',
        content: `LEARNING OBJECTIVES:
• Understand the digital marketing funnel
• Define and track meaningful KPIs
• Map customer journeys across touchpoints

KEY CONCEPTS:

1. The Marketing Funnel
   Awareness  → Consideration  → Decision  → Retention  → Advocacy
   TOFU: Blog posts, YouTube, social ads (reach new people)
   MOFU: Webinars, case studies, email sequences (nurture interest)
   BOFU: Free trials, demos, discounts (convert to purchase)

2. Key Performance Indicators (KPIs)
   Traffic: sessions, unique visitors, bounce rate
   Engagement: time on page, pages/session, scroll depth
   Conversion: leads, sales, conversion rate (CVR)
   Revenue: CAC (cost to acquire), LTV (lifetime value), ROAS (return on ad spend)

3. Customer Journey Mapping
   Touchpoints: Google search → blog post → retargeting ad → email → purchase
   Each touchpoint needs the right message for that stage.
   Example: First-time visitor sees educational content; cart abandoner sees a discount.

4. Attribution Models
   Last-click: 100% credit to final touchpoint (ignores the journey)
   First-click: 100% credit to first touchpoint
   Linear: equal credit to all touchpoints
   Data-driven (GA4): ML-based credit distribution

5. Owned vs Earned vs Paid Media
   Owned: your website, email list, social profiles
   Earned: press coverage, reviews, word-of-mouth
   Paid: Google Ads, Facebook Ads, sponsored content

SUMMARY:
Effective marketing meets customers where they are with the right message at the right time. Start by defining your funnel and KPIs before spending money on any channel.

PRACTICE:
Map the customer journey for a SaaS product: list all touchpoints from first Google search to paying customer.`,
      },
      {
        title: 'Search Engine Optimization (SEO)',
        content: `LEARNING OBJECTIVES:
• Conduct keyword research and map to pages
• Optimize on-page elements and technical SEO
• Build authority through backlinks

KEY CONCEPTS:

1. How Search Engines Work
   Crawl → Index → Rank
   Googlebot discovers pages by following links, indexes content, ranks by 200+ signals.
   Key signal groups: relevance, authority, user experience.

2. Keyword Research
   Tools: Google Keyword Planner, Ahrefs, SEMrush
   Metrics: Search volume, Keyword Difficulty (KD), CPC
   Intent: Informational ("how to"), Navigational ("spotify login"), Commercial ("best headphones"), Transactional ("buy iPhone 15")
   Target long-tail keywords: "best noise canceling headphones under $100" (lower competition, higher intent)

3. On-Page SEO
   Title tag: primary keyword near the beginning (60 chars max)
   Meta description: compelling, 155 chars, includes keyword
   H1: one per page, matches search intent
   URL: /blog/seo-tips (short, keyword-rich, hyphens not underscores)
   Internal linking: link related pages to distribute "link juice"

4. Technical SEO
   Page speed: Core Web Vitals (LCP < 2.5s, CLS < 0.1, FID < 100ms)
   Mobile-first indexing: Google ranks mobile version of your site
   Schema markup: structured data for rich snippets (stars, FAQs)
   Sitemap.xml + robots.txt configuration

5. Link Building
   Guest posts on industry blogs
   Digital PR (create newsworthy content/data)
   Broken link building (find dead links, offer your content)
   HARO (Help A Reporter Out) — get cited in press articles

SUMMARY:
SEO is a long-term investment. Technical foundations + quality content + earned backlinks = sustainable organic traffic that compounds over time.

PRACTICE:
Pick a topic in your niche. Find 5 long-tail keywords (KD < 30). Write an optimized 1,500-word article outline.`,
      },
      {
        title: 'Google Ads & PPC',
        content: `LEARNING OBJECTIVES:
• Set up and structure Google Ads campaigns
• Write high-converting ad copy
• Optimize bids and Quality Score for profitability

KEY CONCEPTS:

1. Campaign Structure
   Account → Campaigns → Ad Groups → Ads + Keywords
   Best practice: One theme per ad group (tightly themed keywords)
   Example: Campaign = "Running Shoes" → Ad Group = "Trail Running Shoes" → Keywords: trail shoes, off-road running shoes

2. Match Types
   Broad match:    running shoes → triggers for "buy sneakers", "footwear"
   Phrase match:   "running shoes" → triggers for "best running shoes for men"
   Exact match:    [running shoes] → only triggers for "running shoes"
   Start with exact and phrase; expand with broad once profitable.

3. Quality Score (1-10)
   Three factors: Expected CTR + Ad Relevance + Landing Page Experience
   High QS = lower CPC + better ad position. A QS of 8 vs 4 can halve your costs.
   Improve QS: match ad copy to keywords, improve landing page speed/relevance.

4. Ad Copy Formula
   Headline 1: Include keyword (max 30 chars)
   Headline 2: Key benefit ("Free 2-Day Shipping")
   Headline 3: Call to action ("Shop Now & Save 20%")
   Description: Expand on benefit + social proof + urgency

5. Bidding Strategies
   Manual CPC: full control, requires constant monitoring
   Target CPA: Google optimizes to hit your cost-per-acquisition goal
   Target ROAS: optimize for return on ad spend (good for ecommerce)
   Maximize Conversions: spend budget to get most conversions

SUMMARY:
PPC success = right keywords + compelling ads + optimized landing pages. Track conversions, not just clicks. Let Google's smart bidding work once you have enough conversion data (50+/month).

PRACTICE:
Create a Google Ads campaign for a fictional online course. Define campaign structure, 3 ad groups, 5 keywords each, and write 2 ad variants.`,
      },
      {
        title: 'Social Media Marketing',
        content: `LEARNING OBJECTIVES:
• Choose the right platforms for your audience
• Build a content calendar and consistent brand voice
• Run profitable paid social campaigns

KEY CONCEPTS:

1. Platform Selection
   Instagram: visual brands, B2C, 18-34 year olds, lifestyle/fashion/food
   LinkedIn: B2B, professionals, thought leadership, HR/SaaS/consulting
   TikTok: short video, Gen Z + Millennials, entertainment, discovery
   YouTube: educational content, tutorials, long purchase consideration cycles
   Rule: go deep on 2 platforms vs. shallow on 6.

2. Content Strategy
   80/20 rule: 80% value (educate/entertain), 20% promotional
   Content pillars: 3-5 themes you consistently post about
   Example for a fitness brand: Workouts / Nutrition / Success Stories / Behind-the-scenes / Products

3. Content Calendar
   Plan 2-4 weeks ahead. Batch create content weekly.
   Include: post copy, visual brief, hashtags, platform, publish date/time
   Best times (general): Instagram 9-11am, LinkedIn Tuesday-Thursday morning, TikTok 7-9pm

4. Community Management
   Respond to comments within 2 hours (first hour is critical for algorithm)
   Turn comments into content: "You asked, we answered" posts
   Handle negative comments publicly + take to DMs

5. Paid Social
   Audience targeting: interests, behaviors, lookalikes, retargeting
   Creative testing: test 3-5 ad variants simultaneously
   TOFU: awareness video ads | MOFU: carousel/testimonials | BOFU: retargeting with offer

SUMMARY:
Social media marketing is a long game. Consistency beats virality. Build community first, sell second. Use paid social to amplify what's already working organically.

PRACTICE:
Plan a 4-week content calendar for a mobile app launch: 3 posts/week, mix of formats, for Instagram and LinkedIn.`,
      },
      {
        title: 'Email Marketing & Automation',
        content: `LEARNING OBJECTIVES:
• Build and segment an email list strategically
• Create automated drip sequences that convert
• Improve deliverability and open rates

KEY CONCEPTS:

1. List Building
   Lead magnets: free ebook, checklist, webinar, free trial in exchange for email
   Opt-in forms: pop-ups (exit intent), inline, footer, dedicated landing page
   Double opt-in: subscriber confirms → higher quality list, better deliverability

2. Segmentation
   Segment by: behavior (opened/clicked), purchase history, location, lead score
   Example segments:
   • New subscribers (welcome sequence)
   • Active buyers (upsell sequence)
   • Churned customers (win-back sequence)
   Segmented campaigns get 14% higher open rates (Mailchimp data)

3. Email Sequences (Drip Campaigns)
   Welcome sequence (5 emails over 10 days):
   Day 1: Welcome + what to expect
   Day 3: Your best content/resource
   Day 5: Social proof (testimonials/case study)
   Day 7: Soft pitch
   Day 10: Direct offer + urgency

4. Writing High-Converting Emails
   Subject line: <50 chars, curiosity or specificity ("The mistake 87% of marketers make")
   Preview text: extends subject line, not a repeat
   One email = one goal = one CTA
   Plain text often outperforms HTML (feels personal)

5. Deliverability
   Authenticate domain: SPF, DKIM, DMARC records
   Clean list regularly: remove unengaged after 6 months
   Avoid spam trigger words: "FREE!!!", "Act NOW", excessive caps

SUMMARY:
Email has the highest ROI of any marketing channel ($42 for every $1 spent on average). Own your list — social platforms change algorithms; your email list is yours forever.

PRACTICE:
Write a 5-email welcome sequence for a new subscriber to an online cooking course.`,
      },
      {
        title: 'Analytics & Reporting',
        content: `LEARNING OBJECTIVES:
• Set up Google Analytics 4 and track key events
• Build dashboards to monitor marketing performance
• Make data-driven decisions to optimize campaigns

KEY CONCEPTS:

1. Google Analytics 4 (GA4) Key Concepts
   Event-based model (vs session-based in UA)
   Key reports: Acquisition (where traffic comes from), Engagement (what they do), Monetization (conversions)
   Set up: Goals → Conversions: form submissions, purchases, sign-ups

2. Essential Metrics to Track
   Traffic: Sessions, Users, New vs Returning
   Behavior: Bounce rate, Avg session duration, Pages per session
   Conversions: Goal completions, Conversion rate, Revenue
   Attribution: Source/Medium breakdown (organic/google, social/instagram, email/newsletter)

3. UTM Parameters
   Tag all non-Google links to track in GA4:
   ?utm_source=newsletter&utm_medium=email&utm_campaign=black_friday
   Tools: Google's UTM builder, or manage in a spreadsheet

4. Building Dashboards
   Looker Studio (free): connect GA4, Google Ads, Search Console
   Key widgets: weekly traffic trend, top pages, conversion funnel, channel comparison
   Share automated reports with stakeholders weekly

5. Data-Driven Optimization
   A/B test one variable at a time
   Statistical significance: wait for 95% confidence (use tools like VWO or Google Optimize)
   Example: Tested "Start Free Trial" vs "Get Started" → 23% higher CVR with specificity

SUMMARY:
Analytics turns hunches into facts. Set up tracking before launching campaigns. Review weekly dashboards, run monthly deep-dives, and always tie metrics back to business outcomes (revenue, not just traffic).

PRACTICE:
Set up GA4 for a sample website. Create a Looker Studio dashboard showing: weekly sessions, top 5 traffic sources, and conversion rate by channel.`,
      },
    ],
    quiz: {
      title: 'Digital Marketing Quiz',
      questions: [
        { text: 'What does SEO stand for?', options: ['Search Engine Optimization', 'Social Engagement Output', 'Sales and Engagement Operations', 'Search and Exposure Optimization'], correctAnswer: 0 },
        { text: 'What is a conversion rate?', options: ['Email open rate', 'Percentage of visitors who take desired action', 'Cost per click', 'Social media followers'], correctAnswer: 1 },
        { text: 'Which metric measures ad effectiveness?', options: ['CTR', 'RAM', 'API', 'CSS'], correctAnswer: 0 },
        { text: 'What is A/B testing?', options: ['Alpha and Beta software testing', 'Comparing two versions to see which performs better', 'A type of database query', 'An SEO technique'], correctAnswer: 1 },
      ],
    },
  },
  {
    title: 'Cloud Architecture with AWS',
    description: 'Design and deploy scalable cloud infrastructure on AWS. Covers EC2, S3, RDS, Lambda, and CloudFormation.',
    category: 'DevOps', level: 'ADVANCED', price: 59.99, tags: ['aws', 'cloud', 'infrastructure'],
    instructorIndex: 4,
    chapters: [
      { title: 'AWS Core Services Overview', content: 'IAM users, groups, roles, and policies. VPC subnets, security groups, and NACL. EC2 and S3 basics. The shared responsibility model — AWS secures the cloud, you secure what\'s in it.\n\nKEY SERVICES:\n• IAM: Identity and Access Management — never use root account\n• VPC: Virtual Private Cloud — your isolated network\n• EC2: Elastic Compute Cloud — virtual servers\n• S3: Simple Storage Service — object storage, 99.999999999% durability\n• RDS: Managed relational databases (MySQL, PostgreSQL)\n• CloudWatch: Monitoring, logs, alarms\n\nBEST PRACTICES:\n• Enable MFA on all accounts\n• Use least-privilege IAM policies\n• Enable CloudTrail for audit logging\n• Tag all resources for cost tracking' },
      { title: 'Compute & Auto Scaling', content: 'EC2 instance families: General (t3, m5), Compute (c5), Memory (r5), Storage (i3). On-demand vs Reserved (up to 75% savings) vs Spot (up to 90% savings for fault-tolerant workloads).\n\nAUTO SCALING:\n• Launch Template: defines EC2 configuration\n• Auto Scaling Group: maintains fleet of instances\n• Scaling policies: target tracking (keep CPU at 70%), step, scheduled\n• Scale out: add instances when demand rises\n• Scale in: remove instances when demand falls\n\nELASTIC LOAD BALANCING:\n• ALB (Application LB): Layer 7, path/host-based routing\n• NLB (Network LB): Layer 4, ultra-low latency\n• Pattern: Internet → ALB → Auto Scaling Group → RDS' },
      { title: 'Storage Solutions', content: 'S3 STORAGE CLASSES (cost vs access tradeoff):\n• S3 Standard: frequent access, lowest latency\n• S3 Intelligent-Tiering: auto-moves between tiers based on access\n• S3 Standard-IA: infrequent access, 40% cheaper\n• S3 Glacier Instant: archive, millisecond retrieval\n• S3 Glacier Deep Archive: cheapest, 12-hour retrieval\n\nEBS (Elastic Block Store):\n• Attached to EC2 like a hard drive\n• gp3: general purpose SSD (most workloads)\n• io2: provisioned IOPS for databases\n\nEFS (Elastic File System):\n• Shared NFS filesystem across multiple EC2 instances\n• Auto-scales, serverless, pay-per-use\n\nLifecycle Policies:\n• Automatically transition objects between storage classes\n• Example: Standard → IA after 30 days → Glacier after 90 days' },
      { title: 'Serverless with Lambda', content: 'LAMBDA FUNDAMENTALS:\n• Run code without managing servers\n• Triggered by: API Gateway, S3 events, DynamoDB streams, SQS, EventBridge\n• Pricing: pay per request + compute time (first 1M requests free)\n• Timeout: max 15 minutes\n• Cold start: ~100-500ms (use Provisioned Concurrency to eliminate)\n\nEXAMPLE LAMBDA FUNCTION:\nimport json\ndef handler(event, context):\n    return {\n        "statusCode": 200,\n        "body": json.dumps({"message": "Hello!"})\n    }\n\nSERVERLESS PATTERNS:\n• API: Lambda + API Gateway + DynamoDB\n• ETL: S3 trigger → Lambda → process → save to S3/RDS\n• Cron jobs: EventBridge scheduled rule → Lambda\n\nSTEP FUNCTIONS:\n• Orchestrate multi-step workflows\n• Handle retries, error handling, parallel execution visually' },
      { title: 'Infrastructure as Code', content: 'WHY IaC:\n• Reproducible environments: dev = staging = production\n• Version controlled infrastructure (git history)\n• Rollback broken changes instantly\n• Document what exists via code\n\nCLOUDFORMATION:\nResources:\n  MyBucket:\n    Type: AWS::S3::Bucket\n    Properties:\n      BucketName: my-app-bucket\n      VersioningConfiguration:\n        Status: Enabled\n\nTERRAFORM:\nresource "aws_s3_bucket" "app" {\n  bucket = "my-app-bucket"\n}\n\nCDK (Cloud Development Kit):\n• Write infrastructure in TypeScript/Python\n• Generates CloudFormation under the hood\n• Reuse constructs like npm packages\n\nGITOPS WORKFLOW:\n1. Engineer commits IaC to git\n2. PR triggers plan (preview changes)\n3. Merge → CI applies changes to AWS' },
      { title: 'Security & Compliance', content: 'DEFENSE IN DEPTH:\nApply security at every layer: network, compute, data, application, identity\n\nKEY SECURITY SERVICES:\n• WAF (Web Application Firewall): block SQL injection, XSS, rate limiting\n• Shield: DDoS protection (Standard free, Advanced $3k/month)\n• GuardDuty: ML-based threat detection (unusual API calls, crypto mining)\n• Inspector: vulnerability scanning for EC2 and container images\n• Macie: discover and protect sensitive data (PII) in S3\n• Secrets Manager: rotate database passwords automatically\n\nENCRYPTION:\n• At rest: KMS (Key Management Service) encrypts S3, EBS, RDS\n• In transit: enforce HTTPS with ACM certificates + HSTS headers\n\nCOMPLIANCE FRAMEWORKS:\n• SOC 2: security, availability, processing integrity\n• GDPR: EU data protection\n• HIPAA: healthcare data (requires BAA with AWS)\n• PCI DSS: payment card data' },
    ],
    quiz: {
      title: 'AWS Cloud Architecture Quiz',
      questions: [
        { text: 'What does S3 stand for?', options: ['Simple Storage Service', 'Scalable Server System', 'Secure Storage Solution', 'Standard Service Suite'], correctAnswer: 0 },
        { text: 'Which service provides serverless compute?', options: ['EC2', 'RDS', 'Lambda', 'ECS'], correctAnswer: 2 },
        { text: 'What is an IAM role?', options: ['A database user', 'A set of permissions for AWS services', 'A network firewall rule', 'A storage bucket policy'], correctAnswer: 1 },
        { text: 'Which AWS service provides managed Kubernetes?', options: ['ECS', 'EKS', 'EC2', 'ECR'], correctAnswer: 1 },
      ],
    },
  },
  {
    title: 'Business Strategy & Entrepreneurship',
    description: 'Build and scale a successful business. Learn business model design, financial modeling, fundraising, and go-to-market strategy.',
    category: 'Business', level: 'INTERMEDIATE', price: 34.99, tags: ['startup', 'strategy', 'leadership'],
    instructorIndex: 5,
    chapters: [
      { title: 'Business Model Design', content: 'BUSINESS MODEL CANVAS (9 Building Blocks):\n1. Customer Segments: Who are you creating value for?\n   Example: Airbnb serves two segments — travelers AND property owners\n\n2. Value Proposition: What problem do you solve?\n   Good VP: "We help [customer] achieve [goal] by [unique solution], unlike [alternative]"\n   Example: Slack — "Replace email for team communication with real-time, searchable, integrated messaging"\n\n3. Channels: How do you reach customers?\n   Direct: website, sales team\n   Indirect: app stores, resellers, marketplaces\n\n4. Revenue Streams:\n   SaaS: recurring subscription (predictable, high LTV)\n   Marketplace: transaction fee (Airbnb takes 3-5% from hosts)\n   Freemium: free tier → paid upgrade (Spotify, Dropbox)\n\n5. Competitive Moats:\n   Network effects: more users = more value (WhatsApp, Uber)\n   Switching costs: painful to leave (Salesforce, enterprise software)\n   Data moat: proprietary data advantage (Google, Amazon)\n   Brand: premium perception (Apple, Rolex)' },
      { title: 'Market Research & Validation', content: 'CUSTOMER DISCOVERY (Before Building):\nDo 20+ interviews before writing code. Goal: validate that the problem is real and painful.\n\nGood interview questions:\n• "Tell me about the last time you struggled with [problem]"\n• "How do you currently solve this? What do you hate about it?"\n• "How much does this problem cost you (time/money)?"\n\nMVP TYPES:\n• Concierge MVP: do it manually first (Zappos sold shoes manually before automating)\n• Wizard of Oz: fake automation behind the scenes\n• Landing page + waitlist: test demand before building\n• Prototype: clickable Figma prototype to test UX\n\nPRODUCT-MARKET FIT SIGNALS:\n• Sean Ellis Test: "How disappointed would you be if product disappeared?" → 40%+ say "very"\n• NPS > 50 consistently\n• Organic word-of-mouth without marketing spend\n• Retention curves flatten (users stick around)\n\nVALIDATION FRAMEWORK:\n1. Define hypothesis: "SMBs will pay $99/mo for automated invoicing"\n2. Test: build landing page, run $500 in ads, measure sign-ups\n3. Learn: what objections appear? What messaging resonates?' },
      { title: 'Financial Planning & Modeling', content: 'KEY FINANCIAL STATEMENTS:\n1. P&L (Income Statement): Revenue - COGS - OpEx = Net Income\n2. Balance Sheet: Assets = Liabilities + Equity\n3. Cash Flow Statement: most important for startups (cash is king)\n\nSAAS UNIT ECONOMICS:\n• CAC (Customer Acquisition Cost) = Total Sales&Marketing Spend / New Customers\n• LTV (Lifetime Value) = ARPU × Gross Margin % × Average Customer Lifetime\n• LTV:CAC ratio > 3x = healthy, > 5x = very healthy\n• CAC Payback Period: < 12 months for SaaS\n\nExample: Slack\nARPU = $100/month, Gross Margin = 70%, Avg Lifetime = 3 years\nLTV = $100 × 0.7 × 36 = $2,520\nIf CAC = $500, LTV:CAC = 5.04x (excellent)\n\nFINANCIAL PROJECTIONS:\n• 3-year model: build bottom-up (not wishful top-down)\n• Key drivers: new customers/month, churn rate, ARPU, headcount growth\n• Scenario analysis: base, bull, bear cases\n\nBURN RATE & RUNWAY:\nBurn Rate = Monthly cash spent\nRunway = Cash in Bank / Monthly Burn\nRaise before you have 6 months runway left' },
      { title: 'Fundraising & Investor Relations', content: 'FUNDING STAGES:\nPre-seed ($50k-$500k): friends, family, angels, accelerators\nSeed ($500k-$3M): angels, micro-VCs, syndicates\nSeries A ($3M-$15M): VCs, lead investor takes board seat\nSeries B+ ($15M+): growth stage, scaling what works\n\nINVESTOR TYPES:\n• Angels: high net worth individuals, invest $10k-$100k, value-add mentorship\n• Micro-VCs: $10-50M funds, specialize in seed (YC, First Round)\n• Growth VCs: Sequoia, a16z, looking for 10x+ returns\n\nPITCH DECK STRUCTURE (10 slides):\n1. Problem — pain and who has it\n2. Solution — your unique approach\n3. Market Size — TAM/SAM/SOM\n4. Product — demo or screenshots\n5. Traction — metrics (MRR, growth rate, NPS)\n6. Business Model — how you make money\n7. Go-To-Market — how you\'ll scale\n8. Team — why you\'ll win\n9. Competition — landscape and your edge\n10. Ask — how much, use of funds, milestones\n\nSAFE vs PRICED ROUND:\nSAFE (Simple Agreement for Future Equity): quick, cheap, converts at next round\nProved Round: sets a company valuation, more complex, takes 2-3 months' },
      { title: 'Go-to-Market Strategy', content: 'GO-TO-MARKET MOTIONS:\nProduct-Led Growth (PLG): product is the sales funnel (Notion, Figma, Slack)\n• Users discover → adopt → expand → team adopts → company buys\nSales-Led: SDR prospecting → demo → proposal → negotiation → close (enterprise)\nMarketing-Led: content/SEO → lead gen → nurture → sales-qualified lead\n\nIDEAL CUSTOMER PROFILE (ICP):\nCompany: 50-200 employees, B2B SaaS, Series A-B, remote-first\nBuyer: Head of Engineering or CTO\nTrigger: just raised funding, recently expanded team, new compliance requirement\nExclusions: enterprises >1000 employees (too long sales cycle)\n\nPRICING STRATEGY:\nValue-based: charge based on value delivered, not cost-plus\nTier pricing: Starter ($29) / Pro ($99) / Enterprise (custom)\nAnchoring: show enterprise first to make Pro seem affordable\nAnnual plans: offer 2 months free for annual (reduces churn, increases cash flow)\n\nSALES PLAYBOOK:\nProspecting → Qualification → Discovery → Demo → Proposal → Negotiation → Close → Onboard\nAvg B2B SaaS sales cycle: 30 days (SMB) to 6-12 months (enterprise)' },
      { title: 'Leadership & Team Building', content: 'HIRING FOR CULTURE AND COMPETENCE:\nFirst hires are disproportionately important — they set the culture.\nHire for: high agency, intellectual honesty, learning velocity, complementary skills\nAvoid: "brilliant jerks" (destroy team morale) and "yes people" (no challenge)\n\nOKR FRAMEWORK:\nObjectives: qualitative, inspirational goals ("Become the category leader in workflow automation")\nKey Results: 3-5 measurable outcomes per objective (not tasks)\n  KR1: Grow MRR from $100k to $250k\n  KR2: Achieve NPS > 60\n  KR3: Reduce churn from 5% to 2% monthly\nCadence: annual Objectives, quarterly KRs, weekly reviews\n\nPERFORMANCE MANAGEMENT:\n1:1s weekly: "What are you working on? What blockers? What support do you need?"\nFeedback: Specific, Behavioral, Timely — not annual reviews\n"What does great look like?" — make expectations explicit\n\nSCALING CULTURE:\n0-10 people: culture happens naturally, founder sets tone\n10-50 people: document values, rituals, hiring bar\n50-200 people: managers become culture carriers\n200+ people: culture must be systematized (onboarding, L&D, comms)\n\nCOMMON PITFALLS:\n• Hiring too fast before product-market fit\n• Promoting individual contributors to managers without training\n• Not firing fast enough when culture fit breaks down' },
    ],
    quiz: {
      title: 'Business Strategy Quiz',
      questions: [
        { text: 'What does MVP stand for?', options: ['Most Valuable Player', 'Minimum Viable Product', 'Maximum Value Proposition', 'Market Validation Process'], correctAnswer: 1 },
        { text: 'What is a SAFE note?', options: ['A type of bank account', 'Simple Agreement for Future Equity', 'A security protocol', 'A financial statement'], correctAnswer: 1 },
        { text: 'What framework maps business model components?', options: ['SWOT Analysis', 'Business Model Canvas', 'Porter Five Forces', 'OKR Framework'], correctAnswer: 1 },
        { text: 'What is product-market fit?', options: ['When the product is fully built', 'When a product satisfies strong market demand', 'When revenue exceeds costs', 'When the team is complete'], correctAnswer: 1 },
      ],
    },
  },
  {
    title: 'Advanced TypeScript & System Design',
    description: 'Deep-dive into TypeScript generics, design patterns, distributed systems, microservices, and system design interview prep.',
    category: 'Web Development', level: 'ADVANCED', price: 54.99, tags: ['typescript', 'system-design', 'microservices'],
    instructorIndex: 6,
    chapters: [
      { title: 'TypeScript Generics & Advanced Types', content: 'GENERICS — Write once, use with any type:\nfunction identity<T>(arg: T): T { return arg }\nidentity<string>("hello")  // T = string\nidentity<number>(42)       // T = number\n\nGENERIC CONSTRAINTS:\nfunction getLength<T extends { length: number }>(arg: T): number {\n  return arg.length  // safe: T guaranteed to have .length\n}\n\nUTILITY TYPES:\nPartial<User>     // all fields optional\nRequired<User>    // all fields required\nReadonly<User>    // no mutation allowed\nPick<User, "name" | "email">  // subset of fields\nOmit<User, "password">        // exclude fields\nRecord<string, User>          // dictionary type\n\nCONDITIONAL TYPES:\ntype IsArray<T> = T extends any[] ? true : false\ntype Flatten<T> = T extends Array<infer U> ? U : T\n// Flatten<string[]> = string\n\nTEMPLATE LITERAL TYPES:\ntype EventName = "click" | "focus" | "blur"\ntype Handler = `on${Capitalize<EventName>}`\n// Handler = "onClick" | "onFocus" | "onBlur"' },
      { title: 'Design Patterns in TypeScript', content: 'WHY PATTERNS: Proven solutions to recurring problems. Common vocabulary for teams.\n\n1. FACTORY PATTERN\nCreate objects without specifying exact class:\ninterface Logger { log(msg: string): void }\nclass FileLogger implements Logger { log = (msg) => writeFile(msg) }\nclass ConsoleLogger implements Logger { log = (msg) => console.log(msg) }\nfunction createLogger(env: string): Logger {\n  return env === "prod" ? new FileLogger() : new ConsoleLogger()\n}\n\n2. OBSERVER PATTERN (Event System)\nclass EventEmitter<T> {\n  private listeners = new Map<string, Set<(data: T) => void>>()\n  on(event: string, fn: (data: T) => void) { ... }\n  emit(event: string, data: T) { ... }\n}\n\n3. STRATEGY PATTERN\nEncapsulate algorithms and make them interchangeable:\ninterface SortStrategy { sort(data: number[]): number[] }\nclass QuickSort implements SortStrategy { ... }\nclass MergeSort implements SortStrategy { ... }\nclass Sorter { constructor(private strategy: SortStrategy) {} }\n\n4. SOLID PRINCIPLES\nS: Single Responsibility — one class, one reason to change\nO: Open/Closed — open for extension, closed for modification\nL: Liskov Substitution — subtypes replaceable for base types\nI: Interface Segregation — small, specific interfaces\nD: Dependency Inversion — depend on abstractions, not concretions' },
      { title: 'Microservices Architecture', content: 'MONOLITH vs MICROSERVICES:\nMonolith: simple to develop, deploy, debug. Gets painful at scale (1 bug deploys everything, teams block each other).\nMicroservices: independent deployment, scale services independently, tech flexibility. Complex to operate.\n\nSERVICE DECOMPOSITION PATTERNS:\n• By Business Capability: OrderService, InventoryService, PaymentService\n• By Subdomain (DDD): Bounded contexts with clear interfaces\n• Strangler Fig: gradually replace monolith piece by piece\n\nINTER-SERVICE COMMUNICATION:\nSync (REST/gRPC): good for queries needing immediate response\nAsync (Message Queue): good for commands, better resilience\nGRPC advantages: binary protocol (10x faster), strongly typed contracts, streaming\n\nAPI GATEWAY PATTERN:\nSingle entry point for all clients:\n• Route requests to appropriate service\n• Handle auth, rate limiting, SSL termination\n• Aggregate responses from multiple services\nTools: Kong, AWS API Gateway, nginx\n\nSAGA PATTERN (Distributed Transactions):\nManage transactions across services without 2PC:\nChoreography: services react to events (decentralized)\nOrchestration: central saga coordinator manages steps\nExample: Order saga — reserve inventory → charge payment → notify shipping' },
      { title: 'Event-Driven Systems', content: 'WHY EVENT-DRIVEN:\n• Services decouple: producer doesn\'t know about consumers\n• Resilience: consumers can be down, catch up later\n• Audit log: full history of what happened (event sourcing)\n• Scale: Kafka handles millions of events per second\n\nMESSAGE QUEUES vs STREAMS:\nRabbitMQ (Queue): point-to-point, message consumed once, routing rules\nKafka (Stream): log-based, messages retained, multiple consumers, replay past events\n\nKAFKA CONCEPTS:\n• Topic: named stream of events ("orders", "user-events")\n• Partition: parallelism unit — more partitions = more consumers\n• Consumer Group: set of consumers sharing partitions (each message processed once per group)\n• Offset: position in partition — allows replaying from any point\n\nEVENT SOURCING:\nStore state as sequence of immutable events instead of current state:\nEvents: UserRegistered → EmailVerified → ProfileUpdated → Subscribed\nCurrent state = replay all events\nBenefits: full audit trail, time travel, event replay\n\nCQRS (Command Query Responsibility Segregation):\nWrite model: handles commands (CreateOrder), updates event store\nRead model: materialized views optimized for specific queries\nSynchronized via domain events' },
      { title: 'Distributed Systems Fundamentals', content: 'CAP THEOREM:\nIn a distributed system, you can only guarantee 2 of 3:\nConsistency: all nodes see the same data\nAvailability: every request gets a response\nPartition Tolerance: system works despite network failures\nIn practice: network partitions happen, so choose CP or AP.\nCP: bank systems (consistency over availability)\nAP: shopping cart, social feed (availability over consistency)\n\nCONSISTENCY MODELS (weakest to strongest):\nEventual: data will be consistent eventually (DNS, Cassandra)\nRead-your-writes: user always sees their own updates\nMonotonic: once you read value X, never read older value\nStrong (Linearizable): all operations appear instantaneous (Zookeeper)\n\nDISTRIBUTED TRANSACTIONS:\nTwo-Phase Commit (2PC): coordinator asks all to prepare, then commit\nProblems: coordinator failure = blocked forever\nSaga Pattern: compensating transactions for rollback\n\nCONSISTENT HASHING:\nUsed in distributed caches (Redis Cluster, Cassandra)\nAdding/removing nodes only remaps K/N keys (not all keys)\nVirtual nodes: each server gets multiple positions on ring\n\nFAULT TOLERANCE PATTERNS:\nCircuit Breaker: stop calling failing service, fallback instead\nRetry with exponential backoff + jitter\nBulkhead: isolate failures (thread pool per service)' },
      { title: 'System Design Interview Prep', content: 'FRAMEWORK (use this for every system design question):\n1. Clarify requirements (5 min): functional + non-functional\n2. Estimate scale (2 min): users, RPS, storage, bandwidth\n3. High-level design (10 min): major components\n4. Deep dive (20 min): interviewer-directed, 1-2 components\n5. Bottlenecks & trade-offs (5 min)\n\nDESIGN TWITTER:\nFunctional: post tweets, follow users, home timeline, search\nScale: 300M users, 500M tweets/day, read-heavy (100:1 read:write)\n\nKey decisions:\n• Fanout on write vs read for timeline: write better for active users (<1000 followers), read for celebrities\n• Database: users/tweets in PostgreSQL, timeline cache in Redis\n• Media: store in S3, serve via CDN (CloudFront)\n• Search: Elasticsearch for full-text search\n• Rate limiting: token bucket per user at API gateway\n\nDESIGN URL SHORTENER:\nGenerate short ID → store in DB → redirect on lookup\nKey design: base62 encoding, handle collisions, cache popular URLs\n\nDESIGN RATE LIMITER:\nAlgorithms: Token bucket, Leaky bucket, Fixed window, Sliding window\nDistributed: use Redis with atomic Lua scripts\nWhere: at API gateway, per user, per endpoint\n\nNUMBERS TO KNOW:\n1M req/day = ~12 req/sec\nMySQL: 1000 QPS, PostgreSQL: 5000 QPS, Redis: 100,000 QPS\nLatency: Redis 0.1ms, SSD 0.1ms, network 1ms, HDD 10ms' },
    ],
    quiz: {
      title: 'TypeScript & System Design Quiz',
      questions: [
        { text: 'What does CAP theorem stand for?', options: ['Consistency, Availability, Partition tolerance', 'Compute, Access, Performance', 'Cache, API, Protocol', 'Code, Architecture, Patterns'], correctAnswer: 0 },
        { text: 'What is a generic in TypeScript?', options: ['A variable type', 'A reusable type parameter', 'A class method', 'An interface property'], correctAnswer: 1 },
        { text: 'What does CQRS stand for?', options: ['Command Query Responsibility Segregation', 'Code Quality Review System', 'Concurrent Queue Response Strategy', 'Cache Query Resolution Service'], correctAnswer: 0 },
        { text: 'What is event sourcing?', options: ['Logging HTTP events', 'Storing state as sequence of events', 'A CSS animation technique', 'A testing methodology'], correctAnswer: 1 },
      ],
    },
  },
  {
    title: 'Deep Learning & Neural Networks',
    description: 'Master deep learning with PyTorch. Build CNNs, RNNs, Transformers, and LLMs. Covers NLP and production ML deployment.',
    category: 'Data Science', level: 'ADVANCED', price: 64.99, tags: ['pytorch', 'deep-learning', 'transformers'],
    instructorIndex: 7,
    chapters: [
      { title: 'Neural Network Fundamentals', content: 'THE PERCEPTRON:\ny = activation(w₁x₁ + w₂x₂ + ... + b)\nWeights (w): how much each input matters\nBias (b): shifts the activation threshold\nActivation function: introduces non-linearity\n\nACTIVATION FUNCTIONS:\nReLU: max(0, x) — most common, fast, solves vanishing gradient\nSigmoid: 1/(1+e^-x) — output 0-1, used for binary classification\nSoftmax: normalizes to probabilities, used for multi-class output\nTanh: output -1 to 1, zero-centered (better than sigmoid)\n\nFORWARD PROPAGATION:\nInput → Layer 1 → Layer 2 → Output → Loss\nEach layer: Z = XW + b, then A = activation(Z)\n\nBACKPROPAGATION:\nCalculate gradient of loss w.r.t. each weight using chain rule\ndL/dW = dL/dA × dA/dZ × dZ/dW\n\nGRADIENT DESCENT VARIANTS:\nSGD: update one sample at a time (noisy but fast)\nMini-batch: update on 32-256 samples (balance of noise/speed)\nAdam: adaptive learning rates per parameter (most popular)\nLearning rate: too high = diverge, too low = slow convergence' },
      { title: 'Convolutional Neural Networks', content: 'WHY CNNs FOR IMAGES:\nFlattening 224×224 image = 50,176 inputs → fully connected is computationally impossible.\nCNNs exploit spatial locality: nearby pixels are related.\n\nCONVOLUTION OPERATION:\nFilter (kernel) slides over image, computing dot product at each position.\n3×3 filter on 32×32 image → learns to detect edges, curves, textures.\nMultiple filters → multiple feature maps.\n\nCNN LAYERS:\nConv2D: learns spatial features\nBatchNorm: stabilizes training, faster convergence\nReLU: non-linearity\nMaxPooling: downsample, translation invariance, reduce computation\nDropout: randomly zero neurons (regularization, prevents overfitting)\nFlatten → Dense → Softmax: classification head\n\nARCHITECTURES:\nLeNet (1998): pioneered CNNs\nAlexNet (2012): won ImageNet, deep learning revolution\nVGG16: simple, very deep, good baseline\nResNet: skip connections — trains 100+ layer networks\nEfficientNet: best accuracy/compute tradeoff\n\nTRANSFER LEARNING:\n# Use pretrained ResNet50, replace last layer\nmodel = torchvision.models.resnet50(pretrained=True)\nmodel.fc = nn.Linear(2048, num_classes)\n# Freeze early layers, fine-tune last few\nFreezes early feature detectors (edges, textures) — just train classification head.' },
      { title: 'Recurrent Networks & LSTMs', content: 'WHY RECURRENT NETWORKS:\nSequential data: text, audio, time series. Each output depends on previous inputs.\nRNN: hidden state passed through time — but suffers vanishing gradients on long sequences.\n\nVANISHING GRADIENT PROBLEM:\nGradient shrinks exponentially over 100+ timesteps.\nResult: network "forgets" information from early in sequence.\nSolution: LSTM and GRU with gating mechanisms.\n\nLSTM (Long Short-Term Memory):\nThree gates control information flow:\n• Forget gate: what to discard from cell state (f = σ(Wf·[h,x] + bf))\n• Input gate: what new information to store\n• Output gate: what to output from cell state\nCell state: the "memory" highway — gradients flow without vanishing\n\nGRU (Gated Recurrent Unit):\nSimplified LSTM: 2 gates instead of 3, no separate cell state.\nFaster to train, similar performance. Use when sequence < 100 steps.\n\nAPPLICATIONS:\nText generation: predict next word given context\nSentiment analysis: classify review as positive/negative\nTime series forecasting: predict stock prices, weather\nMachine translation: encoder LSTM + decoder LSTM (seq2seq)\n\nLIMITATIONS:\nSequential computation — can\'t parallelize across timesteps.\nStill struggles with very long-range dependencies (>500 tokens).\n→ This is why Transformers replaced RNNs for NLP.' },
      { title: 'Transformer Architecture', content: 'THE ATTENTION REVOLUTION (2017 "Attention Is All You Need"):\nReplaced RNNs for NLP. Enables parallelization + captures long-range dependencies.\n\nSELF-ATTENTION:\nFor each word, compute how much to "attend" to every other word.\nQ (Query), K (Key), V (Value) matrices — learned projections of input.\nAttention(Q,K,V) = softmax(QKᵀ/√dk) × V\nExample: "The animal didn\'t cross the street because it was too tired"\n"it" attends strongly to "animal" — resolves coreference.\n\nMULTI-HEAD ATTENTION:\nRun attention multiple times in parallel with different learned projections.\n8-16 heads: each learns different relationship types (syntax, semantics, coreference)\nConcat all heads → linear projection.\n\nPOSITIONAL ENCODING:\nAttention is order-invariant — add position info:\nPE(pos, 2i) = sin(pos/10000^(2i/d_model))\nAllows model to know "this is the 5th word".\n\nTRANSFORMER BLOCK:\nMulti-Head Attention → Add & Norm → Feed-Forward → Add & Norm\nResidual connections prevent vanishing gradients in 12-96 layer models.\n\nBERT vs GPT:\nBERT: encoder-only, bidirectional, good for classification/QA\nGPT: decoder-only, autoregressive, good for generation\nT5: encoder-decoder, framed all tasks as text-to-text' },
      { title: 'Fine-tuning Large Language Models', content: 'FROM SCRATCH vs FINE-TUNING:\nTraining from scratch: billions of $ in compute. Not realistic for most.\nFine-tuning: adapt pretrained model to your task. 100-1000x cheaper.\n\nFULL FINE-TUNING:\nUpdate all model weights on your dataset.\nRequires same GPU memory as training from scratch.\nWhen to use: large dataset (>100k examples), significant domain shift.\n\nPARAMETER-EFFICIENT FINE-TUNING (PEFT):\nFreeze most weights, only train small additions.\n\nLoRA (Low-Rank Adaptation):\nAdd low-rank matrices to attention layers:\nW\' = W + BA  where B∈R^(d×r), A∈R^(r×k), r << d\nr=16: only 0.1% of parameters trained. Same quality as full fine-tuning.\nImplementation: from peft import LoraConfig, get_peft_model\n\nINSTRUCTION TUNING:\nTrain on (instruction, response) pairs to follow human instructions.\nFormat: "Summarize the following article: {article}" → "{summary}"\nDatasets: Alpaca, FLAN, OpenAssistant\n\nRLHF (Reinforcement Learning from Human Feedback):\n1. Supervised fine-tuning on demonstration data\n2. Train reward model from human preference comparisons\n3. RL (PPO) to optimize policy toward reward model\nUsed by: GPT-4, Claude, Gemini\n\nDEPLOYMENT:\nQuantization: INT8/INT4 reduces memory 4-8x (bitsandbytes, GPTQ)\nHugging Face: from transformers import pipeline\npipe = pipeline("text-generation", model="mistralai/Mistral-7B-Instruct-v0.1")' },
      { title: 'Production ML Systems', content: 'THE GAP: 90% of ML models never reach production.\nML system = model code (5%) + everything else (95%)\n\nML PIPELINE:\nData → Validation → Feature Engineering → Training → Evaluation → Registry → Serving → Monitoring\n\nMLFLOW:\nimport mlflow\nwith mlflow.start_run():\n    mlflow.log_param("learning_rate", 0.001)\n    mlflow.log_metric("accuracy", 0.95)\n    mlflow.sklearn.log_model(model, "model")\nTrack experiments, compare runs, register models with versioning.\n\nMODEL SERVING:\nFastAPI endpoint:\n@app.post("/predict")\nasync def predict(data: InputData):\n    features = preprocess(data)\n    prediction = model.predict(features)\n    return {"result": prediction}\nDocker + Kubernetes for scaling. Load balancer in front.\n\nMONITORING:\nData drift: input distribution changed (retrain needed)\nModel degradation: accuracy drops on new data\nInfrastructure: latency p99, error rate, throughput\nTools: Evidently AI, Whylogs, Prometheus + Grafana\n\nA/B TESTING MODELS:\nRoute 10% traffic to new model, 90% to old.\nMeasure business metrics, not just accuracy.\nStatistical significance before full rollout.\n\nFEATURE STORE:\nCentralized feature computation and serving (Feast, Tecton).\nPrevents train/serve skew — same features in training and production.' },
    ],
    quiz: {
      title: 'Deep Learning Quiz',
      questions: [
        { text: 'What is backpropagation?', options: ['A data preprocessing step', 'Algorithm to compute gradients for training', 'A regularization technique', 'A neural network architecture'], correctAnswer: 1 },
        { text: 'What does CNN stand for?', options: ['Computer Neural Network', 'Convolutional Neural Network', 'Cascaded Node Network', 'Connected Neuron Network'], correctAnswer: 1 },
        { text: 'What is the key innovation of Transformers?', options: ['Convolutional layers', 'Self-attention mechanism', 'Recurrent connections', 'Batch normalization'], correctAnswer: 1 },
        { text: 'What does LoRA stand for?', options: ['Loss Optimized Regularization Approach', 'Low-Rank Adaptation', 'Long Range Attention', 'Layered Output Representation Algorithm'], correctAnswer: 1 },
      ],
    },
  },
  {
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform iOS and Android apps with React Native and Expo. Covers navigation, native APIs, animations, and deployment.',
    category: 'Web Development', level: 'INTERMEDIATE', price: 44.99, tags: ['react-native', 'expo', 'mobile'],
    instructorIndex: 8,
    chapters: [
      { title: 'React Native & Expo Setup', content: 'REACT NATIVE vs EXPO:\nBare React Native: maximum control, write native modules, steeper setup.\nExpo: managed workflow, 90% of apps need nothing more. Start here.\n\nEXPO SETUP:\nnpx create-expo-app MyApp --template blank-typescript\ncd MyApp && npx expo start\nScan QR with Expo Go app on your phone. Live reload instantly.\n\nPROJECT STRUCTURE:\n/app          → screens (Expo Router file-based routing)\n/components   → reusable UI components\n/hooks        → custom hooks (useColorScheme, useAuth)\n/constants    → Colors.ts, typography\n/assets       → images, fonts\n\nEXPO SDK MODULES:\nexpo-camera, expo-location, expo-notifications, expo-image-picker\nInstall: npx expo install expo-camera (manages version compatibility)\n\nDEBUGGING:\nExpo Dev Tools: browser-based debugger\nFlipper: native debugger for bare RN (network inspector, Redux)\nReact DevTools: component tree inspection\nconsole.log: appears in terminal running expo start\n\nTYPESCRIPT CONFIG:\nApp.tsx entry point. tsconfig.json pre-configured.\nBenefit: catch type errors before seeing them on device.' },
      { title: 'Core Components & Styling', content: 'CORE COMPONENTS vs HTML:\nView (div), Text (p/span), TextInput (input), ScrollView (div with overflow)\nImage, TouchableOpacity (button), FlatList (virtualized list), Modal\n\nFLEXBOX IN REACT NATIVE:\nDefault: flexDirection is "column" (unlike web\'s row)\nflex: 1 fills available space\n<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>\n\nSTYLESHEET API:\nconst styles = StyleSheet.create({\n  container: { flex: 1, backgroundColor: "#fff", padding: 16 },\n  title: { fontSize: 24, fontWeight: "bold", color: "#1a1a2e" },\n  button: { backgroundColor: "#6c63ff", borderRadius: 12, padding: 16 }\n})\n\nNo CSS classes — styles are JavaScript objects.\nCamelCase: backgroundColor not background-color\n\nFONTS:\nimport { useFonts } from "expo-font"\nconst [fontsLoaded] = useFonts({ "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf") })\n\nDARK MODE:\nconst colorScheme = useColorScheme()  // "dark" | "light"\nconst bgColor = colorScheme === "dark" ? "#000" : "#fff"' },
      { title: 'Navigation with React Navigation', content: 'EXPO ROUTER (File-based routing, recommended):\napp/index.tsx → / (home)\napp/profile.tsx → /profile\napp/(tabs)/home.tsx → tab navigator\napp/courses/[id].tsx → dynamic route\n\nNAVIGATION PATTERNS:\nStack: push/pop screens (default navigation)\nTabs: bottom tab bar (main app navigation)\nDrawer: side menu (settings, profile)\nModal: overlay screen\n\nSTACK NAVIGATION:\nimport { router } from "expo-router"\nrouter.push("/course/123")  // navigate forward\nrouter.back()               // go back\nrouter.replace("/home")     // replace without back option\n\nPASSING PARAMS:\nrouter.push({ pathname: "/course/[id]", params: { id: "123" } })\n// In destination:\nconst { id } = useLocalSearchParams()\n\nAUTH FLOW:\nApp starts → check if logged in → redirect to /login or /(tabs)\nUse Slot and redirects in _layout.tsx for auth guards\n\nDEEP LINKING:\nAndroid: android.intent.action.VIEW → myapp://course/123\niOS: URL scheme in app.json → myapp://course/123\nUseful for push notification navigation' },
      { title: 'Native APIs & Device Features', content: 'CAMERA:\nimport { CameraView, useCameraPermissions } from "expo-camera"\nconst [permission, requestPermission] = useCameraPermissions()\nif (!permission?.granted) return <Button onPress={requestPermission} title="Allow Camera" />\n\nLOCATION:\nimport * as Location from "expo-location"\nconst { status } = await Location.requestForegroundPermissionsAsync()\nconst location = await Location.getCurrentPositionAsync({})\n// location.coords.latitude, location.coords.longitude\n\nPUSH NOTIFICATIONS:\nimport * as Notifications from "expo-notifications"\nconst token = await Notifications.getExpoPushTokenAsync()\n// Send token to your server, use Expo Push API to send\n\nASYNC STORAGE (persist data):\nimport AsyncStorage from "@react-native-async-storage/async-storage"\nawait AsyncStorage.setItem("@user_token", token)\nconst token = await AsyncStorage.getItem("@user_token")\n\nEXPO IMAGE PICKER:\nconst result = await ImagePicker.launchImageLibraryAsync({\n  mediaTypes: ImagePicker.MediaTypeOptions.Images,\n  allowsEditing: true,\n  aspect: [4, 3]\n})\nif (!result.canceled) setImage(result.assets[0].uri)\n\nPERMISSIONS BEST PRACTICE:\nAlways request permission before using, explain why, handle denial gracefully.' },
      { title: 'Animations & Gestures', content: 'ANIMATED API (built-in):\nconst fadeAnim = useRef(new Animated.Value(0)).current\nAnimated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start()\n<Animated.View style={{ opacity: fadeAnim }} />\n\nuseNativeDriver: true → animation runs on native thread (smooth 60fps)\nOnly works with: opacity, transform (translateX, scale, rotate)\n\nREANIMATED 3 (recommended for complex animations):\nimport Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated"\n\nconst offset = useSharedValue(0)\nconst animatedStyle = useAnimatedStyle(() => ({\n  transform: [{ translateX: offset.value }]\n}))\n\n// Trigger animation:\noffset.value = withSpring(100)  // spring physics!\noffset.value = withTiming(0, { duration: 300 })\n\nGESTURE HANDLER:\nimport { PanGestureHandler } from "react-native-gesture-handler"\nHandle swipes, pinches, taps with precise control.\n\nPRACTICAL EXAMPLES:\nPull-to-refresh: Animated.spring + onRefresh\nSlide-in menu: translateX animation triggered by state\nSwipeable cards (Tinder-style): PanGestureHandler + rotation transform\nBouncing button: scale animation on press\n\nPERFORMANCE TIPS:\nAvoid setState inside animations\nUse useNativeDriver always when possible\nInteractionManager.runAfterInteractions for heavy tasks after animations' },
      { title: 'App Store Deployment', content: 'EAS (EXPO APPLICATION SERVICES):\nCloud build service — no need for Mac to build iOS!\nnpx eas build:configure\nnpx eas build --platform ios    → builds .ipa in cloud\nnpx eas build --platform android → builds .aab in cloud\n\nAPP STORE (iOS) REQUIREMENTS:\n• Apple Developer Account ($99/year)\n• App Icons: 1024×1024 PNG (no transparency)\n• Screenshots: iPhone 6.5", iPad Pro 12.9"\n• Privacy policy URL\n• App Review: 1-7 days\n• TestFlight: beta testing up to 10,000 users\n\nGOOGLE PLAY (Android) REQUIREMENTS:\n• Google Play Developer Account ($25 one-time)\n• App Bundle (.aab) — smaller than .apk\n• Screenshots: phone + 7" tablet\n• Feature graphic: 1024×500\n• App Review: few hours to 3 days\n• Internal/Alpha/Beta testing tracks\n\nVERSIONING:\napp.json: "version": "1.2.0" (shown to users)\n"ios": { "buildNumber": "10" } (must increment each submission)\n"android": { "versionCode": 10 } (must increment)\n\nOVER-THE-AIR UPDATES (EAS Update):\nShip JavaScript changes without App Store review!\nnpx eas update --branch production --message "Fix login bug"\nLimitation: can\'t update native code (new Expo SDK version, new native modules)' },
    ],
    quiz: {
      title: 'React Native Quiz',
      questions: [
        { text: 'What is Expo?', options: ['A database for React Native', 'A platform and toolset for React Native development', 'A UI component library', 'A state management solution'], correctAnswer: 1 },
        { text: 'Which component is best for long lists in React Native?', options: ['ScrollView', 'FlatList', 'ListView', 'MapView'], correctAnswer: 1 },
        { text: 'What does EAS stand for?', options: ['Expo App Studio', 'Expo Application Services', 'External App System', 'Enhanced Android Support'], correctAnswer: 1 },
        { text: 'How do you style components in React Native?', options: ['CSS files', 'Styled-components only', 'StyleSheet API or inline styles', 'SCSS modules'], correctAnswer: 2 },
      ],
    },
  },
  {
    title: 'Graphic Design & Brand Identity',
    description: 'Create stunning visual identities and marketing materials. Learn Adobe Illustrator, brand strategy, logo design, and typography.',
    category: 'Design', level: 'BEGINNER', price: 29.99, tags: ['illustrator', 'branding', 'typography'],
    instructorIndex: 9,
    chapters: [
      {
        title: 'Fundamentals of Graphic Design',
        content: `LEARNING OBJECTIVES:
• Understand the 7 elements of design
• Apply composition principles to create visual balance
• Use colour theory to evoke emotion and meaning

KEY CONCEPTS:

1. The 7 Elements of Design
   Line      — guides the eye, creates movement (horizontal=calm, diagonal=energy)
   Shape     — geometric (structured) vs organic (natural)
   Form      — 3D shapes, depth through shadow/perspective
   Colour    — hue, saturation, value; evokes emotion
   Texture   — surface quality (rough/smooth, real or implied)
   Space     — positive (subject) vs negative (empty space around it)
   Typography — letterforms as visual elements, not just text

2. Composition Principles
   Rule of thirds: divide canvas in 3×3 grid; place subjects at intersections
   Visual hierarchy: most important element is largest/boldest/highest contrast
   Balance: symmetrical (formal) or asymmetrical (dynamic)
   Contrast: difference in size, color, weight creates visual interest
   White space: "breathing room" makes designs feel premium and clear

3. Colour Theory Basics
   Primary: Red, Yellow, Blue
   Secondary: Orange, Green, Purple (mixing primaries)
   Complementary pairs (opposite on wheel): Blue + Orange, Red + Green
   Warm colours: advance visually (red, orange, yellow) — urgency, energy
   Cool colours: recede (blue, purple, green) — calm, trust, professionalism
   Example: Banks use blue (trust), fast food uses red/yellow (urgency, appetite)

4. Visual Hierarchy in Practice
   Size: large = important (headings vs body text)
   Colour: bright/saturated draws eye first
   Position: top-left first in Western reading direction
   Contrast: high contrast stands out against muted backgrounds

SUMMARY:
Design is visual communication. Every element should serve a purpose. Learn to see before you design — analyze what makes effective designs work and why.

PRACTICE:
Find 3 brand logos. Identify: what elements/principles they use, what emotion they convey, and whether it matches the brand's industry.`,
      },
      {
        title: 'Adobe Illustrator Mastery',
        content: `LEARNING OBJECTIVES:
• Navigate Illustrator and use core vector tools
• Create and edit paths with the Pen tool
• Use pathfinder and boolean operations for complex shapes

KEY CONCEPTS:

1. Vector vs Raster
   Vector: mathematical paths — scales to any size without quality loss (logos, icons, print)
   Raster: pixels — fixed resolution (photos, realistic textures)
   SVG is vector; JPEG/PNG is raster.
   Rule: logos and icons should always be vector.

2. The Pen Tool (Most Important)
   Click: creates corner anchor points (straight lines)
   Click + drag: creates smooth anchor points (curved bezier)
   Common shortcuts:
   P = Pen tool
   A = Direct Selection (move individual anchor points)
   Ctrl+Z = undo (use liberally while learning)

3. The Pathfinder Panel
   Unite: merge shapes into one
   Minus Front: subtract top shape from bottom (punch holes)
   Intersect: keep only overlapping area
   Divide: split all shapes at intersections
   Example: Create letter with inner cutout using Minus Front on two rectangles.

4. Layers & Organization
   Use layers: Backgrounds | Elements | Text | Guides
   Lock layers you're not editing
   Name every layer and group logically
   Good organization = easy client revisions

5. Artboards
   Multiple artboards in one file = multiple sizes/versions
   Example: Logo file with artboards for horizontal, stacked, icon, dark/light versions

SUMMARY:
Mastering the Pen tool unlocks all of Illustrator. Practice tracing simple shapes daily for 2 weeks — it becomes muscle memory. Pathfinder lets you create any complex shape from simple primitives.

PRACTICE:
Trace 5 simple logos using only the Pen tool. Then create a flat icon set (10 icons) using basic shapes + Pathfinder.`,
      },
      {
        title: 'Logo Design Process',
        content: `LEARNING OBJECTIVES:
• Follow a professional logo design process from brief to delivery
• Develop concepts through sketching and iteration
• Present designs professionally to clients

KEY CONCEPTS:

1. The Brief (Foundation)
   Essential questions:
   • What do you do and who is your customer?
   • What are 3-5 adjectives for your brand personality?
   • Who are your competitors? What do you NOT want to look like?
   • Where will the logo be used? (print, digital, embroidery, signage)
   • What's your budget and timeline?

2. Research & Inspiration
   Study competitors (to differentiate, not copy)
   Explore: Pinterest, Dribbble, Behance, Brand New blog
   Look outside your industry for fresh ideas
   Create a mood board: 20-30 images capturing the brand feeling

3. Sketching (Quantity First)
   Generate 20-30 rough thumbnails before touching software
   Explore directions: wordmark, lettermark, icon + text, emblem
   No polishing at this stage — just ideas
   Best ideas emerge from iteration, not perfection

4. Refinement in Illustrator
   Take top 3-5 sketches to vector
   Test at multiple sizes: 500px to 16px favicon
   Test in black and white first (color can hide weak forms)
   Test on light AND dark backgrounds

5. Client Presentation
   Present 3 directions (not 1 — gives choice, not rejection)
   Show in context: business card, app icon, signage mockup
   Explain rationale for each concept
   Avoid presenting work you don't believe in

6. File Delivery Package
   Formats: SVG, AI, PDF (vector); PNG transparent (raster)
   Colors: defined in Pantone (print), CMYK (print), RGB+HEX (digital)
   Minimum size guide, exclusion zone (clear space around logo)
   Usage guidelines document

SUMMARY:
The best logos are simple, memorable, versatile, and appropriate for the brand. Spend 50% of time on research/sketching, 30% refinement, 20% presentation. Never skip sketching.

PRACTICE:
Design a logo for a fictional coffee brand called "Origin Roasters" targeting specialty coffee enthusiasts. Document your full process.`,
      },
      {
        title: 'Typography & Type Design',
        content: `LEARNING OBJECTIVES:
• Classify and select appropriate typefaces
• Pair fonts effectively for visual harmony
• Apply type hierarchy for clear communication

KEY CONCEPTS:

1. Type Classification
   Serif: traditional, trustworthy, print (Times New Roman, Garamond)
   Sans-Serif: modern, clean, digital (Helvetica, Inter, Futura)
   Slab Serif: strong, bold, impactful (Rockwell, Clarendon)
   Display/Script: personality, headlines only (never body text)
   Monospace: code, tech aesthetic (IBM Plex Mono, Courier)

2. Anatomy of Type
   Baseline: line text sits on
   Cap height: top of uppercase letters
   x-height: height of lowercase "x" — large x-height = more readable at small sizes
   Ascender: parts above x-height (d, b, h, k)
   Descender: parts below baseline (g, p, y, q)
   Kerning: space between specific letter pairs (AV, LT look wrong without kerning)
   Tracking: overall letter spacing in a block of text

3. Font Pairing Rules
   Rule 1: Contrast — pair a serif with a sans-serif
   Rule 2: Limit to 2 fonts (3 maximum, each with a purpose)
   Rule 3: Same foundry families often pair well (Google Fonts curates pairs)

   Examples that work:
   • Playfair Display (serif heading) + Source Sans Pro (body)
   • Montserrat (bold header) + Open Sans (body)
   • Archivo Black (display) + Merriweather (body text)

4. Type Hierarchy
   H1 (Hero): 48-96px, bold, brand font
   H2 (Section): 32-40px, semibold
   H3 (Subsection): 24px
   Body: 16-18px, regular weight, 1.5× line height
   Caption: 12-14px, muted color

5. Readability Rules
   Line length: 50-75 characters (about 12-14 words)
   Line height (leading): 1.4-1.6× the font size
   Body text: never use pure black (#000) — use #333 or #1a1a2e on white
   All caps: use for short labels/headings only, add letter-spacing (+0.1em)

SUMMARY:
Typography is 95% of design. Getting type right makes average layouts look premium. Master one font pairing system, use it consistently, then expand.

PRACTICE:
Design a 3-page editorial layout for a magazine article. Use 2 fonts, establish clear hierarchy (H1, H2, body, caption), and ensure readability at print size.`,
      },
      {
        title: 'Brand Identity Systems',
        content: `LEARNING OBJECTIVES:
• Build a complete brand identity system
• Create usage guidelines for consistent application
• Design across print and digital touchpoints

KEY CONCEPTS:

1. What is a Brand Identity System?
   The set of visual elements that consistently represent a brand:
   Logo suite + Color palette + Typography + Imagery style + Iconography + Voice/Tone

   Goal: recognize the brand without seeing the name.
   Example: You can identify Coca-Cola from red+white+Spencerian script alone.

2. Color Palette Structure
   Primary (1-2 colors): dominant brand colors (logo, key UI elements)
   Secondary (2-4 colors): supporting palette for variety
   Neutral (2-3 grays/whites): backgrounds, text
   Semantic: green=success, red=error, yellow=warning

   Specify: Pantone (physical print), CMYK (digital print), RGB+HEX (screens)

3. Logo Variations
   Primary: full color on white/light backgrounds
   Reversed: white logo on dark/colored backgrounds
   One-color: for embroidery, debossing, single-color print
   Icon only: for app icons, favicons, small uses
   Horizontal + Stacked: for different orientations

4. Brand Guidelines Document
   Logo usage: do's and don'ts (no stretched, rotated, recolored logos)
   Clear space: minimum exclusion zone around logo (= height of "x" in logo)
   Minimum sizes: 24px digital, 0.5" print
   Typography: which fonts for which uses
   Photography style: examples of on-brand vs off-brand images
   Examples: Apple brand guidelines, NASA Graphics Standards Manual (public)

5. Touchpoint Applications
   Stationery: business card, letterhead, email signature
   Digital: website, social media templates, email newsletters
   Physical: packaging, signage, merchandise, uniforms
   Motion: logo animation, presentation templates

SUMMARY:
A brand identity system is a multiplier — good design done once, applied everywhere. Invest in a thorough guidelines document; it saves expensive inconsistencies later and enables any designer to produce on-brand work.

PRACTICE:
Create a complete mini brand identity for "Bloom" — a wellness app. Deliver: logo suite, color palette, type pairing, and a guidelines 1-pager.`,
      },
    ],
    quiz: {
      title: 'Graphic Design Quiz',
      questions: [
        { text: 'What is the difference between RGB and CMYK?', options: ['RGB for print, CMYK for screen', 'RGB for screen, CMYK for print', 'They are the same', 'RGB is grayscale'], correctAnswer: 1 },
        { text: 'What is kerning?', options: ['Adjusting spacing between all letters', 'Adjusting spacing between specific letter pairs', 'Changing font weight', 'Scaling text uniformly'], correctAnswer: 1 },
        { text: 'What is a vector graphic?', options: ['A pixel-based image', 'A mathematical path-based image that scales infinitely', 'A compressed photo format', 'A 3D rendering'], correctAnswer: 1 },
        { text: 'What format is best for logos?', options: ['JPEG', 'PNG', 'SVG', 'GIF'], correctAnswer: 2 },
      ],
    },
  },
  // ── Instructor 0 (Jane Smith) — course 10 ────────────────────────────────
  {
    title: 'Advanced TypeScript for React Developers',
    description: 'Deep dive into TypeScript generics, utility types, and advanced patterns to write bulletproof React applications.',
    category: 'Web Development', level: 'ADVANCED', price: 59.99, tags: ['typescript', 'react', 'generics'],
    instructorIndex: 0,
    chapters: [
      { title: 'TypeScript Generics Deep Dive', content: `## Learning Objectives\n- Write reusable generic functions and interfaces\n- Constrain generics with extends and keyof\n- Build type-safe utility helpers\n\n## Key Concepts\n\n**Generic Functions**\n\`\`\`ts\nfunction identity<T>(arg: T): T { return arg }\nconst result = identity<string>('hello') // result: string\n\`\`\`\n\n**Constrained Generics**\n\`\`\`ts\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key]\n}\n\`\`\`\n\n## Summary\nGenerics eliminate duplication while preserving type safety. Master them to build reusable, type-safe libraries.\n\n## Practice\nWrite a generic \`ApiResponse<T>\` wrapper type and use it in a fetch utility.` },
      { title: 'Utility Types & Mapped Types', content: `## Learning Objectives\n- Use built-in utility types (Partial, Required, Pick, Omit)\n- Create custom mapped types\n- Transform types programmatically\n\n## Key Concepts\n\n**Built-in Utilities**\n\`\`\`ts\ntype UserPartial = Partial<User>   // all optional\ntype UserName = Pick<User, 'name' | 'email'>\ntype NoId = Omit<User, 'id'>\n\`\`\`\n\n**Custom Mapped Type**\n\`\`\`ts\ntype Nullable<T> = { [K in keyof T]: T[K] | null }\n\`\`\`\n\n## Summary\nUtility types let you derive new types from existing ones, reducing redundancy.\n\n## Practice\nCreate a \`ReadonlyDeep<T>\` utility type that recursively marks all properties as readonly.` },
      { title: 'Type Guards & Narrowing', content: `## Learning Objectives\n- Write custom type guards with is keyword\n- Use discriminated unions effectively\n- Narrow unknown types safely\n\n## Key Concepts\n\n**Type Guard**\n\`\`\`ts\nfunction isString(val: unknown): val is string {\n  return typeof val === 'string'\n}\n\`\`\`\n\n**Discriminated Union**\n\`\`\`ts\ntype Shape = { kind: 'circle'; radius: number } | { kind: 'square'; side: number }\nfunction area(s: Shape) {\n  if (s.kind === 'circle') return Math.PI * s.radius ** 2\n  return s.side ** 2\n}\n\`\`\`\n\n## Summary\nType guards and narrowing let TypeScript infer precise types at runtime, preventing runtime errors.\n\n## Practice\nBuild a type-safe event system using discriminated unions for event payloads.` },
    ],
    quiz: { title: 'TypeScript Quiz', questions: [
      { text: 'What does keyof return?', options: ['All values', 'All keys as a union type', 'An array of keys', 'A string'], correctAnswer: 1 },
      { text: 'What does Partial<T> do?', options: ['Makes all required', 'Makes all optional', 'Removes all keys', 'Readonly'], correctAnswer: 1 },
    ]},
  },
  // ── Instructor 1 (Michael Chen) — course 11 ───────────────────────────────
  {
    title: 'Deep Learning with PyTorch',
    description: 'Build neural networks from scratch using PyTorch. Cover CNNs, RNNs, transformers, and real-world model training.',
    category: 'Data Science', level: 'ADVANCED', price: 69.99, tags: ['pytorch', 'deep-learning', 'neural-networks'],
    instructorIndex: 1,
    chapters: [
      { title: 'Neural Network Fundamentals', content: `## Learning Objectives\n- Understand perceptrons and activation functions\n- Build a simple feedforward network in PyTorch\n- Implement forward and backward pass manually\n\n## Key Concepts\n\n**Tensor Basics**\n\`\`\`python\nimport torch\nx = torch.tensor([[1.0, 2.0], [3.0, 4.0]])\nprint(x.shape)  # torch.Size([2, 2])\n\`\`\`\n\n**Simple Linear Layer**\n\`\`\`python\nmodel = torch.nn.Linear(2, 1)\noutput = model(x)\n\`\`\`\n\n## Summary\nPyTorch tensors are the foundation. Every neural network is a composition of differentiable operations on tensors.\n\n## Practice\nImplement a single neuron from scratch: weights, bias, sigmoid activation, and gradient descent.` },
      { title: 'Convolutional Neural Networks', content: `## Learning Objectives\n- Understand convolution operations and filter learning\n- Build a CNN for image classification\n- Use pooling and batch normalization\n\n## Key Concepts\n\n**CNN Architecture**\n\`\`\`python\nclass SimpleCNN(torch.nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.conv1 = torch.nn.Conv2d(1, 32, 3)\n        self.pool = torch.nn.MaxPool2d(2)\n        self.fc = torch.nn.Linear(32*13*13, 10)\n\`\`\`\n\n## Summary\nCNNs learn spatial hierarchies: edges → shapes → objects. They are the backbone of computer vision.\n\n## Practice\nTrain a CNN on MNIST. Achieve >98% accuracy. Visualize the learned filters.` },
      { title: 'Training Loops & Optimization', content: `## Learning Objectives\n- Write a complete training loop\n- Use Adam, SGD, and learning rate schedulers\n- Monitor training with loss curves\n\n## Key Concepts\n\n**Training Loop**\n\`\`\`python\nfor epoch in range(epochs):\n    for X, y in dataloader:\n        optimizer.zero_grad()\n        pred = model(X)\n        loss = criterion(pred, y)\n        loss.backward()\n        optimizer.step()\n\`\`\`\n\n## Summary\nThe training loop is the core of deep learning. Understanding gradient flow and optimizer choices directly impacts model performance.\n\n## Practice\nCompare Adam vs SGD on a classification task. Plot loss curves for both.` },
    ],
    quiz: { title: 'Deep Learning Quiz', questions: [
      { text: 'What does backward() do in PyTorch?', options: ['Forward pass', 'Computes gradients', 'Updates weights', 'Loads data'], correctAnswer: 1 },
      { text: 'What is Max Pooling used for?', options: ['Adding features', 'Reducing spatial dimensions', 'Normalization', 'Dropout'], correctAnswer: 1 },
    ]},
  },
  // ── Instructor 2 (Sarah Johnson) — course 12 ─────────────────────────────
  {
    title: 'Motion Design & Animation in Figma',
    description: 'Master animations, micro-interactions, and motion design principles to create delightful, engaging user experiences.',
    category: 'Design', level: 'INTERMEDIATE', price: 44.99, tags: ['figma', 'animation', 'motion-design'],
    instructorIndex: 2,
    chapters: [
      { title: 'Principles of Motion Design', content: `## Learning Objectives\n- Apply the 12 principles of animation to UI\n- Use easing curves purposefully\n- Distinguish functional vs decorative animation\n\n## Key Concepts\n\n**Easing Types**\n- Ease-in: accelerates (objects leaving screen)\n- Ease-out: decelerates (objects entering screen)\n- Ease-in-out: for moving objects across screen\n\n**Duration Guidelines**\n- Micro-interactions: 100–300ms\n- Page transitions: 300–500ms\n- Complex sequences: 500–800ms\n\n## Summary\nGood motion communicates state changes and guides attention. Bad motion distracts and slows users down.\n\n## Practice\nAudit 3 popular apps. List each animation and classify it as functional or decorative.` },
      { title: 'Figma Smart Animate & Prototyping', content: `## Learning Objectives\n- Use Smart Animate for seamless transitions\n- Build interactive prototypes with overlays\n- Create scroll and drag interactions\n\n## Key Concepts\n\n**Smart Animate Requirements**\n- Same layer names across frames\n- Matching component structure\n- Figma interpolates position, size, opacity, rotation\n\n**Overlay Variants**\nUse component variants + interactive components to prototype hover states without duplicate frames.\n\n## Summary\nSmart Animate is Figma's killer feature for prototyping. Name layers consistently and let Figma do the interpolation work.\n\n## Practice\nBuild a bottom sheet component with open/close animation using Smart Animate.` },
      { title: 'Micro-interactions & Feedback Design', content: `## Learning Objectives\n- Design button states (default, hover, pressed, loading, success)\n- Create form validation animations\n- Build skeleton loaders and progress indicators\n\n## Key Concepts\n\n**Button States**\nEvery interactive element needs: Default → Hover → Focus → Active → Disabled → Loading → Success\n\n**Skeleton Loaders**\nShimmer effect: animate a gradient from left to right over grey placeholder shapes. Reduces perceived load time by 20-30%.\n\n## Summary\nMicro-interactions are the polish that separates good products from great ones. Every tap deserves a response.\n\n## Practice\nDesign a complete form submission flow: filling → validation error → loading → success state.` },
    ],
    quiz: { title: 'Motion Design Quiz', questions: [
      { text: 'What easing should a modal use when entering?', options: ['Ease-in', 'Ease-out', 'Linear', 'Bounce'], correctAnswer: 1 },
      { text: 'Ideal duration for a micro-interaction?', options: ['50ms', '200ms', '1000ms', '2000ms'], correctAnswer: 1 },
    ]},
  },
  // ── Instructor 3 (David Kumar) — course 13 ───────────────────────────────
  {
    title: 'Digital Marketing Analytics',
    description: 'Master Google Analytics 4, conversion tracking, A/B testing, and data-driven campaign optimization.',
    category: 'Marketing', level: 'INTERMEDIATE', price: 34.99, tags: ['analytics', 'ga4', 'conversion'],
    instructorIndex: 3,
    chapters: [
      { title: 'Google Analytics 4 Fundamentals', content: `## Learning Objectives\n- Set up GA4 properties and data streams\n- Understand events, parameters, and user properties\n- Build custom reports and explorations\n\n## Key Concepts\n\n**GA4 Event Model**\nGA4 uses an event-based model (vs UA's session-based).\nAll interactions are events: page_view, click, purchase, custom_event.\n\n**Key Reports**\n- Acquisition: where users come from\n- Engagement: what they do\n- Monetization: revenue events\n- Retention: how many return\n\n## Summary\nGA4's flexible event model gives you full control over what you measure. Set up correctly from day one — retroactive data is impossible.\n\n## Practice\nSet up a GA4 property for a sample e-commerce site. Configure purchase and add_to_cart events.` },
      { title: 'Conversion Rate Optimization', content: `## Learning Objectives\n- Identify conversion funnel drop-offs\n- Design and analyze A/B tests\n- Use heatmaps and session recordings\n\n## Key Concepts\n\n**Funnel Analysis**\nMap the steps to conversion: Landing → Product → Cart → Checkout → Purchase\nTypical e-commerce conversion: 1-3%. Even 0.5% improvement = significant revenue.\n\n**A/B Testing**\n- Control: original version (50% traffic)\n- Variant: changed version (50% traffic)\n- Run until statistical significance (p < 0.05, typically 1-2 weeks minimum)\n\n## Summary\nCRO is systematic, not guesswork. Hypothesize → Test → Measure → Iterate. Small wins compound.\n\n## Practice\nDesign an A/B test for a checkout page. Define hypothesis, success metric, and minimum sample size.` },
      { title: 'Attribution & Campaign Tracking', content: `## Learning Objectives\n- Implement UTM parameters correctly\n- Compare attribution models (last-click vs data-driven)\n- Build multi-channel attribution reports\n\n## Key Concepts\n\n**UTM Parameters**\n\`https://site.com?utm_source=google&utm_medium=cpc&utm_campaign=summer-sale\`\nAlways use: source, medium, campaign. Optional: term, content.\n\n**Attribution Models**\n- Last-click: 100% credit to last touchpoint (biases paid search)\n- First-click: 100% to first touchpoint (biases awareness channels)\n- Data-driven: ML-based, most accurate (requires 400+ conversions/month)\n\n## Summary\nAttribution is the lens through which you see marketing effectiveness. Wrong attribution = wrong budget decisions.\n\n## Practice\nCreate a UTM tracking plan for a product launch campaign across 5 channels.` },
    ],
    quiz: { title: 'Marketing Analytics Quiz', questions: [
      { text: 'What does UTM stand for?', options: ['Universal Tracking Method', 'Urchin Tracking Module', 'User Traffic Metric', 'Unified Tag Manager'], correctAnswer: 1 },
      { text: 'What p-value indicates statistical significance?', options: ['p > 0.5', 'p < 0.05', 'p = 1.0', 'p < 0.5'], correctAnswer: 1 },
    ]},
  },
  // ── Instructor 4 (Emily Davis) — course 14 ───────────────────────────────
  {
    title: 'Product Management Fundamentals',
    description: 'Learn how to define product vision, write user stories, manage roadmaps, and ship products that users love.',
    category: 'Business', level: 'BEGINNER', price: 0, tags: ['product', 'agile', 'roadmap'],
    instructorIndex: 4,
    chapters: [
      { title: 'The Role of a Product Manager', content: `## Learning Objectives\n- Describe the PM role vs engineering vs design\n- Understand the product triad model\n- Identify the skills needed to be an effective PM\n\n## Key Concepts\n\n**PM vs Other Roles**\n- PM: What to build and why (problem definition, prioritization)\n- Engineer: How to build it (implementation)\n- Designer: How it looks and feels (UX/UI)\n\n**The PM's North Star**\nAlways ask: "Will this solve a real user problem that also serves business goals?"\n\n## Summary\nPMs are responsible for product outcomes, not output. Success is measured by user and business impact, not features shipped.\n\n## Practice\nInterview a PM at a company. Document their daily responsibilities and how they determine priorities.` },
      { title: 'User Stories & Requirements', content: `## Learning Objectives\n- Write clear user stories with acceptance criteria\n- Break epics into stories and tasks\n- Build a product backlog and prioritize it\n\n## Key Concepts\n\n**User Story Format**\n"As a [user type], I want [action] so that [benefit]"\nExample: "As a student, I want to bookmark chapters so that I can return to them later."\n\n**Acceptance Criteria (Given/When/Then)**\n- Given: context/precondition\n- When: user action\n- Then: expected result\n\n## Summary\nGood user stories keep the team focused on user value, not technical implementation. Acceptance criteria prevent ambiguous "done".\n\n## Practice\nWrite 5 user stories for a notification feature in an LMS. Include acceptance criteria for each.` },
      { title: 'Roadmaps & Prioritization', content: `## Learning Objectives\n- Build a product roadmap (now/next/later)\n- Apply RICE scoring for prioritization\n- Communicate roadmap decisions to stakeholders\n\n## Key Concepts\n\n**RICE Scoring**\n- Reach: How many users affected per quarter?\n- Impact: How much will it move the metric? (3=massive, 1=low)\n- Confidence: How sure are we? (100%=high, 50%=low)\n- Effort: Person-months required\n- Score = (Reach × Impact × Confidence) / Effort\n\n**Now/Next/Later Roadmap**\nAvoid date-based commitments. Communicate themes and outcomes, not feature lists.\n\n## Summary\nPrioritization is a PM's core skill. Use frameworks to remove bias and defend decisions with data.\n\n## Practice\nScore 10 hypothetical features using RICE. Build a Now/Next/Later roadmap from the results.` },
    ],
    quiz: { title: 'Product Management Quiz', questions: [
      { text: 'What does RICE stand for?', options: ['Revenue, Impact, Cost, Effort', 'Reach, Impact, Confidence, Effort', 'Risk, Integration, Cost, Ease', 'Reach, Implementation, Confidence, Engagement'], correctAnswer: 1 },
      { text: 'A user story should focus on?', options: ['Technical details', 'User value and goal', 'Database schema', 'API endpoints'], correctAnswer: 1 },
    ]},
  },
  // ── Instructor 5 (Carlos Rivera) — course 15 ─────────────────────────────
  {
    title: 'Kubernetes for Production',
    description: 'Deploy, scale, and manage containerized applications on Kubernetes. Covers pods, deployments, services, Helm, and monitoring.',
    category: 'DevOps', level: 'ADVANCED', price: 79.99, tags: ['kubernetes', 'k8s', 'docker'],
    instructorIndex: 5,
    chapters: [
      { title: 'Kubernetes Architecture', content: `## Learning Objectives\n- Explain control plane vs worker node components\n- Understand how pods are scheduled\n- Describe the role of etcd, kube-scheduler, kubelet\n\n## Key Concepts\n\n**Control Plane**\n- API Server: all communication goes through it\n- etcd: distributed key-value store for cluster state\n- Scheduler: assigns pods to nodes\n- Controller Manager: maintains desired state\n\n**Worker Nodes**\n- kubelet: runs pods on the node\n- kube-proxy: network routing\n- Container runtime: Docker or containerd\n\n## Summary\nKubernetes is a reconciliation engine — it constantly works to match actual state to desired state. Understanding this is key to debugging.\n\n## Practice\nDraw the architecture of a 3-node cluster. Trace the path of a kubectl apply command.` },
      { title: 'Deployments & Services', content: `## Learning Objectives\n- Create deployments with rolling updates\n- Expose applications with Services (ClusterIP, NodePort, LoadBalancer)\n- Use ConfigMaps and Secrets\n\n## Key Concepts\n\n**Deployment YAML**\n\`\`\`yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: myapp\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: myapp\n  template:\n    spec:\n      containers:\n      - name: myapp\n        image: myapp:1.0\n\`\`\`\n\n## Summary\nDeployments manage pod lifecycle. Services provide stable network endpoints. Together they are the backbone of Kubernetes workloads.\n\n## Practice\nDeploy a Node.js API with 3 replicas. Expose it with a LoadBalancer service. Test rolling updates.` },
      { title: 'Helm Charts & Package Management', content: `## Learning Objectives\n- Install and use Helm 3\n- Create custom Helm charts\n- Manage environment-specific values\n\n## Key Concepts\n\n**Helm Basics**\n\`\`\`bash\nhelm repo add bitnami https://charts.bitnami.com/bitnami\nhelm install my-postgres bitnami/postgresql\nhelm upgrade my-postgres bitnami/postgresql --set auth.password=newpass\n\`\`\`\n\n**Chart Structure**\n- Chart.yaml: metadata\n- values.yaml: default config\n- templates/: Kubernetes manifests with Go templating\n\n## Summary\nHelm packages Kubernetes complexity into reusable, versioned charts. Use it for all non-trivial deployments.\n\n## Practice\nCreate a Helm chart for a web app with configurable replicas, image tag, and environment variables.` },
    ],
    quiz: { title: 'Kubernetes Quiz', questions: [
      { text: 'What stores cluster state in Kubernetes?', options: ['kubelet', 'etcd', 'kube-proxy', 'API Server'], correctAnswer: 1 },
      { text: 'What does a Service do?', options: ['Runs containers', 'Stores secrets', 'Provides stable network endpoint', 'Schedules pods'], correctAnswer: 2 },
    ]},
  },
  // ── Instructor 6 (Priya Patel) — course 16 ───────────────────────────────
  {
    title: 'Generative AI & Prompt Engineering',
    description: 'Master prompt engineering, LLM APIs, RAG patterns, and building real AI-powered applications with OpenAI and Gemini.',
    category: 'Other', level: 'INTERMEDIATE', price: 49.99, tags: ['ai', 'llm', 'prompt-engineering'],
    instructorIndex: 6,
    chapters: [
      { title: 'Prompt Engineering Fundamentals', content: `## Learning Objectives\n- Write clear, effective prompts for LLMs\n- Apply few-shot and chain-of-thought prompting\n- Avoid common prompt failure modes\n\n## Key Concepts\n\n**Zero-Shot vs Few-Shot**\n- Zero-shot: "Translate to French: Hello" → "Bonjour"\n- Few-shot: Provide 2-3 examples before the task — improves accuracy 30-50%\n\n**Chain-of-Thought**\nAdd "Let's think step by step" at the end of complex reasoning prompts. Forces the model to show its work, dramatically improving accuracy.\n\n**System Prompts**\nSet persona, constraints, output format, and tone in the system prompt, not the user message.\n\n## Summary\nPrompting is a skill, not magic. Be specific, provide examples, and constrain the output format.\n\n## Practice\nWrite prompts for: sentiment analysis, JSON extraction from text, and code review. Compare zero-shot vs few-shot accuracy.` },
      { title: 'RAG: Retrieval-Augmented Generation', content: `## Learning Objectives\n- Understand why RAG beats fine-tuning for knowledge tasks\n- Implement a basic RAG pipeline\n- Optimize chunk size and retrieval strategy\n\n## Key Concepts\n\n**RAG Pipeline**\n1. Chunk documents (400-800 tokens with overlap)\n2. Embed chunks (text-embedding-3-small)\n3. Store in vector DB (Pinecone, Chroma, pgvector)\n4. At query time: embed query → find top-k similar chunks → inject into prompt\n\n**Why RAG over Fine-tuning?**\n- RAG: cheap, updatable, cites sources\n- Fine-tuning: expensive, static knowledge, no citations\n\n## Summary\nRAG is the standard pattern for giving LLMs access to private or recent knowledge. Get chunking and retrieval right — everything else is secondary.\n\n## Practice\nBuild a RAG system that answers questions about a PDF document using LangChain + Chroma.` },
      { title: 'Building AI-Powered Applications', content: `## Learning Objectives\n- Integrate OpenAI/Gemini APIs into a web app\n- Stream responses for better UX\n- Handle rate limits, errors, and costs\n\n## Key Concepts\n\n**Streaming Responses**\n\`\`\`ts\nconst stream = await openai.chat.completions.create({\n  model: 'gpt-4o',\n  messages: [...],\n  stream: true,\n})\nfor await (const chunk of stream) {\n  process.stdout.write(chunk.choices[0]?.delta?.content ?? '')\n}\n\`\`\`\n\n**Cost Control**\n- Use gpt-4o-mini for simple tasks (100x cheaper)\n- Cache responses for identical prompts\n- Set max_tokens to limit runaway costs\n\n## Summary\nBuilding on top of LLM APIs is straightforward — the hard parts are latency, cost, and reliability in production.\n\n## Practice\nBuild a streaming chat interface using Next.js + Vercel AI SDK. Add a usage tracker.` },
    ],
    quiz: { title: 'Generative AI Quiz', questions: [
      { text: 'What does RAG stand for?', options: ['Random Answer Generation', 'Retrieval-Augmented Generation', 'Recurrent AI Generation', 'Real-time API Gateway'], correctAnswer: 1 },
      { text: 'Chain-of-thought prompting improves?', options: ['Image generation', 'Complex reasoning accuracy', 'Response speed', 'Token efficiency'], correctAnswer: 1 },
    ]},
  },
  // ── Instructor 7 (Alex Thompson) — course 17 ─────────────────────────────
  {
    title: 'React Native Mobile Development',
    description: 'Build cross-platform iOS and Android apps using React Native. Cover navigation, native APIs, state management, and deployment.',
    category: 'Web Development', level: 'INTERMEDIATE', price: 54.99, tags: ['react-native', 'mobile', 'ios', 'android'],
    instructorIndex: 7,
    chapters: [
      { title: 'React Native Fundamentals', content: `## Learning Objectives\n- Understand how React Native bridges to native components\n- Use core components: View, Text, Image, ScrollView\n- Style components with StyleSheet\n\n## Key Concepts\n\n**Core Components vs Web**\n\`\`\`jsx\n// Web: <div>, <p>, <img>\n// React Native: <View>, <Text>, <Image>\nimport { View, Text, StyleSheet } from 'react-native'\n\nconst Card = () => (\n  <View style={styles.card}>\n    <Text style={styles.title}>Hello!</Text>\n  </View>\n)\nconst styles = StyleSheet.create({\n  card: { padding: 16, backgroundColor: '#fff', borderRadius: 8 }\n})\n\`\`\`\n\n## Summary\nReact Native reuses React concepts but replaces DOM elements with native UI components. The bridge compiles to real native code.\n\n## Practice\nBuild a profile card component with avatar, name, bio, and follow button.` },
      { title: 'Navigation with React Navigation', content: `## Learning Objectives\n- Set up Stack, Tab, and Drawer navigators\n- Pass params between screens\n- Handle deep links\n\n## Key Concepts\n\n**Stack Navigator**\n\`\`\`jsx\nconst Stack = createStackNavigator()\nfunction App() {\n  return (\n    <NavigationContainer>\n      <Stack.Navigator>\n        <Stack.Screen name="Home" component={HomeScreen} />\n        <Stack.Screen name="Detail" component={DetailScreen} />\n      </Stack.Navigator>\n    </NavigationContainer>\n  )\n}\n\`\`\`\n\n## Summary\nReact Navigation is the standard for RN routing. Choose Stack for drill-down, Tab for main sections, Drawer for side menus.\n\n## Practice\nBuild a 3-tab app: Feed, Search, Profile — each with their own stack navigator.` },
      { title: 'Device APIs & Native Modules', content: `## Learning Objectives\n- Access camera, location, and notifications\n- Handle permissions correctly on iOS and Android\n- Use Expo SDK vs bare React Native\n\n## Key Concepts\n\n**Location API**\n\`\`\`js\nimport * as Location from 'expo-location'\nconst { status } = await Location.requestForegroundPermissionsAsync()\nif (status === 'granted') {\n  const loc = await Location.getCurrentPositionAsync({})\n  console.log(loc.coords.latitude, loc.coords.longitude)\n}\n\`\`\`\n\n## Summary\nNative APIs require explicit permissions. Expo simplifies access; bare RN gives more control but more config.\n\n## Practice\nBuild a location tracker that shows the user's current position on a map with live updates.` },
    ],
    quiz: { title: 'React Native Quiz', questions: [
      { text: 'What is the web equivalent of View in React Native?', options: ['<section>', '<div>', '<span>', '<article>'], correctAnswer: 1 },
      { text: 'Which package handles navigation in RN?', options: ['react-router', 'react-navigation', 'next/router', 'expo-router'], correctAnswer: 1 },
    ]},
  },
  // ── Instructor 8 (Yuki Tanaka) — course 18 ───────────────────────────────
  {
    title: 'AWS Cloud Architecture',
    description: 'Design scalable, resilient cloud systems on AWS. Covers EC2, S3, Lambda, RDS, VPC, IAM, and real-world architecture patterns.',
    category: 'DevOps', level: 'INTERMEDIATE', price: 64.99, tags: ['aws', 'cloud', 'architecture'],
    instructorIndex: 8,
    chapters: [
      { title: 'AWS Core Services Overview', content: `## Learning Objectives\n- Identify and describe the 10 most used AWS services\n- Understand the shared responsibility model\n- Navigate the AWS console and CLI\n\n## Key Concepts\n\n**Core Services**\n- Compute: EC2, Lambda, ECS\n- Storage: S3, EBS, EFS\n- Database: RDS, DynamoDB, ElastiCache\n- Network: VPC, Route 53, CloudFront\n- Security: IAM, KMS, Secrets Manager\n\n**Shared Responsibility**\n- AWS: security OF the cloud (hardware, network, hypervisor)\n- You: security IN the cloud (OS patches, app code, IAM)\n\n## Summary\nAWS has 200+ services but 10 cover 80% of use cases. Learn these deeply before branching out.\n\n## Practice\nDeploy a static website on S3 with CloudFront CDN. Configure a custom domain with Route 53.` },
      { title: 'Serverless with AWS Lambda', content: `## Learning Objectives\n- Build and deploy Lambda functions\n- Trigger Lambda from API Gateway, S3, and SQS\n- Manage cold starts and concurrency\n\n## Key Concepts\n\n**Lambda Function**\n\`\`\`js\nexports.handler = async (event) => {\n  const body = JSON.parse(event.body)\n  return {\n    statusCode: 200,\n    body: JSON.stringify({ message: 'Hello ' + body.name })\n  }\n}\n\`\`\`\n\n**Cold Starts**\nFirst invocation after idle: 100-500ms latency. Mitigate with Provisioned Concurrency or keeping functions warm.\n\n## Summary\nServerless eliminates server management. Pay per invocation, scale to zero. Perfect for event-driven workloads.\n\n## Practice\nBuild a REST API with API Gateway + Lambda + DynamoDB. Deploy with the Serverless Framework.` },
      { title: 'VPC Networking & Security', content: `## Learning Objectives\n- Design VPCs with public and private subnets\n- Configure Security Groups and NACLs\n- Set up NAT Gateways and VPN connections\n\n## Key Concepts\n\n**VPC Architecture (3-tier)**\n- Public subnet: load balancers, bastion hosts\n- Private subnet: application servers\n- Database subnet: RDS instances (no internet access)\n\n**Security Groups vs NACLs**\n- SG: stateful, instance-level, allow only\n- NACL: stateless, subnet-level, allow and deny\n\n## Summary\nNetwork isolation is your first line of defence. Private subnets should be the default. Public access should be intentional and minimal.\n\n## Practice\nDesign a 3-tier VPC for a web application. Create the subnets, route tables, and security groups in AWS console.` },
    ],
    quiz: { title: 'AWS Quiz', questions: [
      { text: 'What is AWS Lambda?', options: ['A virtual machine', 'A serverless compute service', 'A database', 'A CDN'], correctAnswer: 1 },
      { text: 'Who is responsible for OS patching on EC2?', options: ['AWS', 'The customer', 'Both', 'Neither'], correctAnswer: 1 },
    ]},
  },
  // ── Instructor 9 (Fatima Al-Hassan) — course 19 ──────────────────────────
  {
    title: 'Brand Strategy & Visual Identity',
    description: 'Build compelling brand strategies. Learn positioning, brand archetypes, visual identity systems, and brand guidelines.',
    category: 'Design', level: 'INTERMEDIATE', price: 39.99, tags: ['branding', 'identity', 'strategy'],
    instructorIndex: 9,
    chapters: [
      { title: 'Brand Strategy Foundations', content: `## Learning Objectives\n- Define brand purpose, vision, and values\n- Identify target audience using psychographic segmentation\n- Differentiate brand positioning from competitors\n\n## Key Concepts\n\n**Brand Archetypes (12 types)**\nHero (Nike), Sage (Google), Explorer (Patagonia), Creator (Adobe)\nArchetypes give brands consistent personality across all touchpoints.\n\n**Positioning Statement**\nFormat: "For [target audience] who [need], [brand] is [category] that [differentiation]. Unlike [competitor], we [key advantage]."\n\n## Summary\nStrategy comes before design. A logo without strategy is decoration. Start with why, then what, then how it looks.\n\n## Practice\nDevelop a brand strategy for a fictional sustainable food startup. Define archetype, positioning, and 3 core values.` },
      { title: 'Logo Design & Visual System', content: `## Learning Objectives\n- Follow the logo design process (brief → sketches → vector)\n- Build a scalable logo system (variations, safe zones)\n- Create a visual identity that works across all media\n\n## Key Concepts\n\n**Logo Design Process**\n1. Brand brief (personality, audience, competitors)\n2. Moodboard (visual references)\n3. Sketch 20+ concepts (don't skip this!)\n4. Refine 3 strongest in Figma/Illustrator\n5. Present with rationale, not just the design\n\n**Logo Kit Must-Haves**\nPrimary + horizontal + icon-only + reversed versions\nVector formats: SVG/AI/EPS + PNG at 2x/3x\n\n## Summary\nA great logo is simple, memorable, versatile, and meaningful. Test it at 16px favicon size and billboard size.\n\n## Practice\nDesign a logo for "EcoTrack" — a carbon footprint tracking app. Deliver full logo kit in Figma.` },
      { title: 'Building Brand Guidelines', content: `## Learning Objectives\n- Document brand guidelines for consistency\n- Define tone of voice and messaging framework\n- Create templates for social media, presentations, and print\n\n## Key Concepts\n\n**Brand Guidelines Structure**\n1. Brand story & mission\n2. Logo usage (dos/don'ts)\n3. Color palette (with HEX, RGB, CMYK, Pantone)\n4. Typography (primary and secondary fonts, hierarchy)\n5. Photography & illustration style\n6. Tone of voice (3-5 personality traits with examples)\n\n**Tone of Voice Examples**\nFriendly: "Let's get started!" vs Formal: "Please proceed with initialization."\n\n## Summary\nBrand guidelines empower teams to create consistently. A 20-page Figma doc shared with every new hire = brand consistency at scale.\n\n## Practice\nCreate a 10-page brand guidelines document for your logo design from the previous chapter.` },
    ],
    quiz: { title: 'Brand Strategy Quiz', questions: [
      { text: 'What is a brand archetype?', options: ['A logo style', 'A personality framework for brands', 'A color palette', 'A font system'], correctAnswer: 1 },
      { text: 'Which formats should a logo kit include?', options: ['JPG only', 'SVG, AI, PNG variations', 'PDF only', 'GIF for animations'], correctAnswer: 1 },
    ]},
  },
]

// Each student gets 4-6 courses with varied progress
const enrollmentPlan: { studentIdx: number; courseIdx: number; chaptersCompleted: number; score: number | null }[] = [
  // Arjun — Full-stack dev, data science focus (6 courses)
  { studentIdx: 0, courseIdx: 0, chaptersCompleted: 6, score: 92 },
  { studentIdx: 0, courseIdx: 1, chaptersCompleted: 4, score: 85 },
  { studentIdx: 0, courseIdx: 6, chaptersCompleted: 6, score: 88 },
  { studentIdx: 0, courseIdx: 7, chaptersCompleted: 3, score: null },
  { studentIdx: 0, courseIdx: 8, chaptersCompleted: 5, score: 79 },
  { studentIdx: 0, courseIdx: 3, chaptersCompleted: 2, score: null },
  // Sophie — Design + marketing (5 courses)
  { studentIdx: 1, courseIdx: 2, chaptersCompleted: 5, score: 95 },
  { studentIdx: 1, courseIdx: 9, chaptersCompleted: 5, score: 91 },
  { studentIdx: 1, courseIdx: 3, chaptersCompleted: 6, score: 88 },
  { studentIdx: 1, courseIdx: 5, chaptersCompleted: 3, score: null },
  { studentIdx: 1, courseIdx: 0, chaptersCompleted: 2, score: null },
  // James — Cloud + backend (5 courses)
  { studentIdx: 2, courseIdx: 4, chaptersCompleted: 6, score: 89 },
  { studentIdx: 2, courseIdx: 0, chaptersCompleted: 4, score: 75 },
  { studentIdx: 2, courseIdx: 6, chaptersCompleted: 5, score: 82 },
  { studentIdx: 2, courseIdx: 1, chaptersCompleted: 3, score: null },
  { studentIdx: 2, courseIdx: 7, chaptersCompleted: 2, score: null },
  // Ananya — Data science full path (6 courses)
  { studentIdx: 3, courseIdx: 1, chaptersCompleted: 6, score: 97 },
  { studentIdx: 3, courseIdx: 7, chaptersCompleted: 6, score: 94 },
  { studentIdx: 3, courseIdx: 0, chaptersCompleted: 4, score: 80 },
  { studentIdx: 3, courseIdx: 5, chaptersCompleted: 5, score: 76 },
  { studentIdx: 3, courseIdx: 8, chaptersCompleted: 3, score: null },
  { studentIdx: 3, courseIdx: 4, chaptersCompleted: 2, score: null },
  // Lucas — Business + marketing (4 courses)
  { studentIdx: 4, courseIdx: 5, chaptersCompleted: 6, score: 83 },
  { studentIdx: 4, courseIdx: 3, chaptersCompleted: 5, score: 78 },
  { studentIdx: 4, courseIdx: 0, chaptersCompleted: 3, score: null },
  { studentIdx: 4, courseIdx: 6, chaptersCompleted: 4, score: 70 },
  // Nina — Deep tech + data (6 courses)
  { studentIdx: 5, courseIdx: 1, chaptersCompleted: 6, score: 94 },
  { studentIdx: 5, courseIdx: 7, chaptersCompleted: 6, score: 96 },
  { studentIdx: 5, courseIdx: 4, chaptersCompleted: 5, score: 87 },
  { studentIdx: 5, courseIdx: 6, chaptersCompleted: 4, score: 85 },
  { studentIdx: 5, courseIdx: 0, chaptersCompleted: 3, score: null },
  { studentIdx: 5, courseIdx: 9, chaptersCompleted: 2, score: null },
  // Omar — Design + mobile (5 courses)
  { studentIdx: 6, courseIdx: 2, chaptersCompleted: 5, score: 80 },
  { studentIdx: 6, courseIdx: 9, chaptersCompleted: 4, score: 74 },
  { studentIdx: 6, courseIdx: 8, chaptersCompleted: 6, score: 88 },
  { studentIdx: 6, courseIdx: 5, chaptersCompleted: 3, score: null },
  { studentIdx: 6, courseIdx: 3, chaptersCompleted: 2, score: null },
  // Emma — Full-stack generalist (6 courses)
  { studentIdx: 7, courseIdx: 0, chaptersCompleted: 6, score: 90 },
  { studentIdx: 7, courseIdx: 1, chaptersCompleted: 5, score: 86 },
  { studentIdx: 7, courseIdx: 8, chaptersCompleted: 6, score: 92 },
  { studentIdx: 7, courseIdx: 6, chaptersCompleted: 4, score: 77 },
  { studentIdx: 7, courseIdx: 2, chaptersCompleted: 3, score: null },
  { studentIdx: 7, courseIdx: 4, chaptersCompleted: 2, score: null },
  // Ravi — DevOps + business (5 courses)
  { studentIdx: 8, courseIdx: 4, chaptersCompleted: 6, score: 91 },
  { studentIdx: 8, courseIdx: 5, chaptersCompleted: 6, score: 93 },
  { studentIdx: 8, courseIdx: 3, chaptersCompleted: 5, score: 85 },
  { studentIdx: 8, courseIdx: 0, chaptersCompleted: 3, score: null },
  { studentIdx: 8, courseIdx: 9, chaptersCompleted: 2, score: null },
  // Isabella — Design specialist (5 courses)
  { studentIdx: 9, courseIdx: 2, chaptersCompleted: 5, score: 88 },
  { studentIdx: 9, courseIdx: 9, chaptersCompleted: 5, score: 95 },
  { studentIdx: 9, courseIdx: 3, chaptersCompleted: 4, score: 79 },
  { studentIdx: 9, courseIdx: 8, chaptersCompleted: 3, score: null },
  { studentIdx: 9, courseIdx: 5, chaptersCompleted: 6, score: 84 },
  // ── New courses (10-19) enrollments ──────────────────────────────────────
  // TypeScript (10)
  { studentIdx: 0, courseIdx: 10, chaptersCompleted: 3, score: 88 },
  { studentIdx: 2, courseIdx: 10, chaptersCompleted: 2, score: null },
  { studentIdx: 7, courseIdx: 10, chaptersCompleted: 3, score: 91 },
  { studentIdx: 4, courseIdx: 10, chaptersCompleted: 1, score: null },
  // Deep Learning/PyTorch (11)
  { studentIdx: 3, courseIdx: 11, chaptersCompleted: 3, score: 95 },
  { studentIdx: 5, courseIdx: 11, chaptersCompleted: 3, score: 90 },
  { studentIdx: 1, courseIdx: 11, chaptersCompleted: 2, score: null },
  { studentIdx: 8, courseIdx: 11, chaptersCompleted: 1, score: null },
  // Motion Design (12)
  { studentIdx: 1, courseIdx: 12, chaptersCompleted: 3, score: 87 },
  { studentIdx: 6, courseIdx: 12, chaptersCompleted: 3, score: 82 },
  { studentIdx: 9, courseIdx: 12, chaptersCompleted: 2, score: null },
  { studentIdx: 3, courseIdx: 12, chaptersCompleted: 1, score: null },
  // Marketing Analytics (13)
  { studentIdx: 1, courseIdx: 13, chaptersCompleted: 3, score: 89 },
  { studentIdx: 4, courseIdx: 13, chaptersCompleted: 3, score: 75 },
  { studentIdx: 6, courseIdx: 13, chaptersCompleted: 2, score: null },
  { studentIdx: 9, courseIdx: 13, chaptersCompleted: 1, score: null },
  // Product Management (14)
  { studentIdx: 4, courseIdx: 14, chaptersCompleted: 3, score: 80 },
  { studentIdx: 7, courseIdx: 14, chaptersCompleted: 3, score: 85 },
  { studentIdx: 2, courseIdx: 14, chaptersCompleted: 2, score: null },
  { studentIdx: 5, courseIdx: 14, chaptersCompleted: 1, score: null },
  // Kubernetes (15)
  { studentIdx: 2, courseIdx: 15, chaptersCompleted: 3, score: 86 },
  { studentIdx: 8, courseIdx: 15, chaptersCompleted: 3, score: 92 },
  { studentIdx: 0, courseIdx: 15, chaptersCompleted: 2, score: null },
  { studentIdx: 5, courseIdx: 15, chaptersCompleted: 1, score: null },
  // Generative AI (16)
  { studentIdx: 0, courseIdx: 16, chaptersCompleted: 3, score: 93 },
  { studentIdx: 3, courseIdx: 16, chaptersCompleted: 3, score: 88 },
  { studentIdx: 6, courseIdx: 16, chaptersCompleted: 2, score: null },
  { studentIdx: 9, courseIdx: 16, chaptersCompleted: 1, score: null },
  // React Native (17)
  { studentIdx: 7, courseIdx: 17, chaptersCompleted: 3, score: 84 },
  { studentIdx: 0, courseIdx: 17, chaptersCompleted: 2, score: null },
  { studentIdx: 4, courseIdx: 17, chaptersCompleted: 3, score: 78 },
  { studentIdx: 6, courseIdx: 17, chaptersCompleted: 1, score: null },
  // AWS (18)
  { studentIdx: 2, courseIdx: 18, chaptersCompleted: 3, score: 90 },
  { studentIdx: 8, courseIdx: 18, chaptersCompleted: 3, score: 87 },
  { studentIdx: 5, courseIdx: 18, chaptersCompleted: 2, score: null },
  { studentIdx: 1, courseIdx: 18, chaptersCompleted: 1, score: null },
  // Brand Strategy (19)
  { studentIdx: 1, courseIdx: 19, chaptersCompleted: 3, score: 91 },
  { studentIdx: 9, courseIdx: 19, chaptersCompleted: 3, score: 96 },
  { studentIdx: 6, courseIdx: 19, chaptersCompleted: 2, score: null },
  { studentIdx: 3, courseIdx: 19, chaptersCompleted: 1, score: null },
]

async function main() {
  console.log('🌱 Seeding database...')

  const hashedPassword = await bcrypt.hash('Password123!', 10)

  // Helper: build a Date in March 2026 at a given day + hour
  function mar(day: number, hour = 10, min = 0) {
    return new Date(2026, 2, day, hour, min, 0) // month is 0-indexed
  }

  // ── Upsert admin ──────────────────────────────────────────────────────────
  console.log('🛡️  Creating admin...')
  await prisma.user.upsert({
    where: { email: 'admin@educore.ai' },
    update: { password: hashedPassword },
    create: { name: 'Admin User', email: 'admin@educore.ai', password: hashedPassword, role: 'ADMIN', createdAt: mar(26, 9, 0) },
  })

  // ── Upsert instructors ────────────────────────────────────────────────────
  // Spread across March 26–27
  const instructorDates = [
    mar(26, 10, 15), mar(26, 11, 30), mar(26, 13, 0),  mar(26, 14, 45), mar(26, 16, 20),
    mar(27,  9, 10), mar(27, 10, 50), mar(27, 12, 30), mar(27, 14,  5), mar(27, 15, 40),
  ]
  console.log('👩‍🏫 Creating instructors...')
  const instructorRecords = []
  for (let i = 0; i < instructors.length; i++) {
    const inst = instructors[i]
    const user = await prisma.user.upsert({
      where: { email: inst.email },
      update: { password: hashedPassword },
      create: { name: inst.name, email: inst.email, password: hashedPassword, role: 'INSTRUCTOR', createdAt: instructorDates[i] },
    })
    instructorRecords.push(user)
  }

  // ── Upsert students ───────────────────────────────────────────────────────
  // Spread across March 27–29
  const studentDates = [
    mar(27, 17, 10), mar(27, 18, 25), mar(27, 19, 50),
    mar(28,  8, 30), mar(28, 10,  0), mar(28, 13, 15), mar(28, 16, 40),
    mar(29,  9,  5), mar(29, 11, 20), mar(29, 14, 55),
  ]
  console.log('🎓 Creating students...')
  const studentRecords = []
  for (let i = 0; i < students.length; i++) {
    const stu = students[i]
    const user = await prisma.user.upsert({
      where: { email: stu.email },
      update: { password: hashedPassword },
      create: { name: stu.name, email: stu.email, password: hashedPassword, role: 'STUDENT', createdAt: studentDates[i] },
    })
    studentRecords.push(user)
  }

  // ── Upsert courses + chapters + quizzes ───────────────────────────────────
  console.log('📚 Creating courses with rich content...')
  const courseRecords = []
  for (const cd of coursesData) {
    const instructor = instructorRecords[cd.instructorIndex]

    let course = await prisma.course.findFirst({ where: { title: cd.title } })
    if (!course) {
      course = await prisma.course.create({
        data: {
          title: cd.title, description: cd.description, category: cd.category,
          level: cd.level as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
          price: cd.price, tags: cd.tags, isPublished: true, instructorId: instructor.id,
        },
      })
    }
    courseRecords.push(course)

    // Update or create chapters with rich content
    const chapterRecords = []
    for (let i = 0; i < cd.chapters.length; i++) {
      const ch = cd.chapters[i]
      const existing = await prisma.chapter.findFirst({ where: { courseId: course.id, order: i + 1 } })
      let chapter
      if (existing) {
        chapter = await prisma.chapter.update({
          where: { id: existing.id },
          data: { title: ch.title, content: ch.content },
        })
      } else {
        chapter = await prisma.chapter.create({
          data: { title: ch.title, content: ch.content, order: i + 1, courseId: course.id },
        })
      }
      chapterRecords.push(chapter)
    }

    // Quiz
    const existingQuiz = await prisma.quiz.findFirst({ where: { courseId: course.id } })
    if (!existingQuiz) {
      await prisma.quiz.create({
        data: {
          title: cd.quiz.title, courseId: course.id,
          questions: { create: cd.quiz.questions.map(q => ({ text: q.text, options: q.options, correctAnswer: q.correctAnswer })) },
        },
      })
    }

    ;(course as Record<string, unknown>)._chapters = chapterRecords
  }

  // ── Enrollments + progress + submissions ──────────────────────────────────
  // Enrollment dates: spread across March 28–30
  // Submission dates: spread across March 29–31
  const enrollmentDatePool = [
    mar(28,  8, 10), mar(28,  9, 25), mar(28, 10, 50), mar(28, 12,  5), mar(28, 13, 30),
    mar(28, 15,  0), mar(28, 16, 45), mar(28, 18, 20), mar(29,  8, 40), mar(29, 10, 15),
    mar(29, 11, 30), mar(29, 13,  0), mar(29, 14, 25), mar(29, 16,  5), mar(29, 17, 50),
    mar(29, 19, 10), mar(30,  8, 35), mar(30, 10, 10), mar(30, 12, 45), mar(30, 14, 20),
    mar(30, 15, 55), mar(30, 17, 30), mar(31,  9,  0), mar(31, 11, 15), mar(31, 13, 40),
    mar(31, 15, 10), mar(31, 16, 50), mar(31, 18, 25),
  ]
  const submissionDatePool = [
    mar(29, 14, 0), mar(29, 16, 30), mar(29, 18, 0),
    mar(30,  9, 0), mar(30, 11, 0), mar(30, 13, 30), mar(30, 15, 45), mar(30, 17, 0),
    mar(31,  8, 0), mar(31, 10, 30), mar(31, 12, 0), mar(31, 14, 15), mar(31, 16, 0), mar(31, 17, 45),
  ]
  let enrollIdx = 0
  let subIdx = 0

  console.log('📝 Creating enrollments and progress...')
  for (const plan of enrollmentPlan) {
    const student = studentRecords[plan.studentIdx]
    const course = courseRecords[plan.courseIdx]
    const chapters = (course as Record<string, unknown>)._chapters as { id: string }[]
    const enrolledAt = enrollmentDatePool[enrollIdx % enrollmentDatePool.length]
    enrollIdx++

    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: student.id, courseId: course.id } },
      update: {},
      create: { userId: student.id, courseId: course.id, enrolledAt },
    })

    const completedChapters = chapters.slice(0, plan.chaptersCompleted)
    for (let ci = 0; ci < completedChapters.length; ci++) {
      const chapter = completedChapters[ci]
      const completedAt = new Date(enrolledAt.getTime() + (ci + 1) * 3_600_000) // +1h per chapter
      await prisma.progress.upsert({
        where: { userId_chapterId: { userId: student.id, chapterId: chapter.id } },
        update: {},
        create: { userId: student.id, chapterId: chapter.id, enrollmentId: enrollment.id, isCompleted: true, completedAt },
      })
    }

    if (plan.score !== null) {
      const quiz = await prisma.quiz.findFirst({ where: { courseId: course.id } })
      if (quiz) {
        const existingSub = await prisma.submission.findFirst({ where: { userId: student.id, quizId: quiz.id } })
        if (!existingSub) {
          const submittedAt = submissionDatePool[subIdx % submissionDatePool.length]
          subIdx++
          await prisma.submission.create({
            data: { userId: student.id, quizId: quiz.id, score: plan.score, answers: [], timeTaken: Math.floor(Math.random() * 600) + 120, submittedAt },
          })
        }
      }
    }
  }

  console.log('✅ Seed complete!')
  console.log(`   ${instructorRecords.length} instructors | ${studentRecords.length} students | ${courseRecords.length} courses`)
  console.log(`   ${enrollmentPlan.length} enrollments with varied progress`)
  console.log('')
  console.log('🔑 All accounts use: Password123!')
  console.log('   admin@educore.ai | jane.smith@educore.ai | arjun.mehta@student.ai')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
