### Problem

1. **Interview Prep**: Ever wanted a platform where you can solve programming questions and write your logic during an
   interview?
    - Deliver your full logic to the interviewer, even if you can't completely solve the problem.
2. **DSA Revision**: Need a place to write and store your logic notes for DSA revision?
    - A structured way to store and review your notes.
3. **Other Needs**: Many more features to come!

## Solution

A single web app that addresses all these problems.

## Getting Started

Open [https://lc-board-ochre.vercel.app/](https://lc-board-ochre.vercel.app/) to see the result.

### Main Feature

From the entered LeetCode question ID, it generates a partitioned page with the problem statement and a whiteboard to
store your logic notes. View the full list of problems solved under the archive section.

## WebApp Overview

1. **LC-Board**: Enter your problem-id to get a page with a whiteboard and the problem statement.
2. **WhiteBoard**: A simple whiteboard for brainstorming.
3. **Archive**: An archive section of all your notes.

## Technologies

**Frontend**: Next.js and Tailwind CSS.

**Backend**: Node.js

1. **Fetching Problem Statement**: Used [lcid.cc](https://lcid.cc) to extract the title-slug of the LeetCode question
   and the LeetCode GRAPHQL API to fetch the problem statement.

**Database**: Google's Firebase (cloud) , Browser storage (local) .

## Glimpses

https://github.com/IamMahfooz/lc-board/assets/92675550/33528593-81d3-4e74-a20a-a7def71c5715

## Contributions

Contributions are welcomed! Feel free to fork the repository and make a pull request.

### How to Contribute

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## Join Us

Join our community and help make LC-Board even better! Your contributions and feedback are highly appreciated.

