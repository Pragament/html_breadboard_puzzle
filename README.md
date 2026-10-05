# Circuit Quest

A responsive, static JavaScript math quiz for phones, tablets and PCs. Solve column (x) and row (y) puzzles to connect points on a Cartesian breadboard.

## Run locally

From this folder, run:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Use an HTTP server rather than opening `index.html` directly, because questions load from JSON.

## GitHub Pages

Push these files to your GitHub repository. In the repository's **Settings → Pages**, choose **Deploy from a branch**, select your branch and the **/ (root)** folder, then save. No build step or dependencies are required. All application paths are relative, so project Pages URLs are supported.

## How to play

- Choose Class 4–10. Questions are shuffled each time a quiz starts. Changing class or restarting clears the current attempt and shuffles again.
- Solve the single displayed question and enter both coordinates. Incorrect answers stay on the question until corrected.
- View an answer with explanations if needed, then enter the coordinates to continue. Revealed answers do not count as correct.
- Each submitted pair adds a wire from the previous coordinate, starting at (0, 0).
- Adjust grid spacing and scroll the breadboard to explore both positive and negative axes.
- Click any question in the continuity tester to animate its incoming wire from the previous question (or the origin for Q1). Revealed answers create a visible wire gap from the previous question, and current stops at that break. After finishing, the total result automatically traces the whole route from origin to the last question. Use **Animate total quiz result** to replay it. Red traces after the first break show disconnected parts of the route. The board highlights the selected endpoint; the LED grades that question independently of earlier breaks. Correct answers pass with a green LED; revealed or unanswered questions fail with a red LED. The optional buzzer uses browser audio.

The question bank contains 21 original practice questions (three per class), covering selected CBSE-aligned topics. It is a starter bank, not complete syllabus coverage. The tester is an educational simulation, not an electrical circuit simulator. Progress is held in memory and resets on reload.

## Add questions

Edit `data/questions.json`. Each question needs a unique `id`, `classLevel` (4–10), `topic`, and `column` and `row` objects, each with a `prompt`, numeric `answer`, and `explanation`. Use integer coordinates for breadboard holes. The grid expands to include the class's answer coordinates and always includes −10 through 10 on both axes.

## Files

- `index.html`: accessible application structure
- `styles.css`: responsive layout and visual styles
- `app.js`: quiz, breadboard plotting and continuity tester
- `data/questions.json`: editable question bank

Google Fonts are optional; system fonts work when unavailable. All quiz functionality runs without external libraries.

## License

GNU Affero General Public License v3.0. See [LICENSE](LICENSE).
