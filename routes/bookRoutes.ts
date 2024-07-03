import express from "express";
import { body, validationResult } from "express-validator";
import Book from "../models/Book";

const router = express.Router();

// POST /api/books - Create a new book
router.post(
  "/api/books",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("publishDate")
      .isISO8601()
      .withMessage("Invalid publish date")
      .toDate(),
    body("price").isNumeric().withMessage("Price must be a number"),
  ],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation Errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description, publishDate, price } = req.body;

      const book = new Book({ name, description, publishDate, price });
      await book.save();

      console.log("Saved Book:", book);

      res.status(201).json({
        success: true,
        message: "Book added successfully",
        data: book,
      });
    } catch (err) {
      console.error("Error Saving Book:", err);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

// GET /api/books - Get all books with pagination and search
router.get("/api/books", async (req, res) => {
  try {
    const { page = 1, limit = 10, q } = req.query;

    const paginationOptions = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    };

    let query = {};
    if (q) {
      query = {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
        ],
      };
    }

    const options = {
      limit: paginationOptions.limit,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      sort: { publishDate: -1 },
    };

    const books = await Book.find(query, null, options);
    const totalBooks = await Book.countDocuments(query);

    res.json({
      data: books,
      page: paginationOptions.page,
      totalPages: Math.ceil(totalBooks / paginationOptions.limit),
      totalItems: totalBooks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

export default router;
