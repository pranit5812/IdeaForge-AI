import sys
import os
import unittest

# Adjust Python path to include backend root directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.gemini_service import get_mock_project_data, generate_project_idea
from app.models.project import ProjectIdea

class TestAIParserAndMockGenerator(unittest.TestCase):
    
    def test_mock_web_domain_structure(self):
        """Verifies that Full-Stack Web domain outputs comply with the Pydantic schema."""
        raw_data = get_mock_project_data(
            domain="Full-Stack Web Development",
            skills=["React", "Node.js"],
            difficulty="Advanced",
            team_size=2,
            duration="4 Weeks"
        )
        
        # Validates Pydantic schema instantiation
        validated_project = ProjectIdea(**raw_data)
        
        self.assertEqual(validated_project.difficulty, "Advanced")
        self.assertIn("React.js", validated_project.tech_stack)
        self.assertTrue(1 <= validated_project.resume_impact <= 100)
        self.assertTrue(0 <= validated_project.originality.innovation_score <= 100)
        self.assertTrue(0 <= validated_project.originality.commonness_score <= 100)
        self.assertTrue(0 <= validated_project.originality.trend_score <= 100)
        self.assertEqual(len(validated_project.roadmap), 4)

    def test_mock_ml_domain_structure(self):
        """Verifies that Machine Learning/AI domain outputs comply with the Pydantic schema."""
        raw_data = get_mock_project_data(
            domain="Artificial Intelligence & ML",
            skills=["PyTorch", "Python"],
            difficulty="Intermediate",
            team_size=3,
            duration="6 Weeks"
        )
        
        validated_project = ProjectIdea(**raw_data)
        
        self.assertEqual(validated_project.difficulty, "Intermediate")
        self.assertIn("PyTorch", validated_project.tech_stack)
        self.assertTrue(validated_project.title.startswith("PulseScan"))
        self.assertTrue(1 <= validated_project.resume_impact <= 100)
        self.assertEqual(len(validated_project.roadmap), 4)

    def test_mock_fallback_domain_structure(self):
        """Verifies fallback/cybersecurity outputs comply with the Pydantic schema."""
        raw_data = get_mock_project_data(
            domain="Cyber Security & Multi-Agent Network",
            skills=["Go", "Docker"],
            difficulty="Expert",
            team_size=1,
            duration="8 Weeks"
        )
        
        validated_project = ProjectIdea(**raw_data)
        
        self.assertEqual(validated_project.difficulty, "Expert")
        self.assertIn("Go", validated_project.tech_stack)
        self.assertTrue(validated_project.title.startswith("SafeNet"))
        self.assertTrue(0 <= validated_project.originality.innovation_score <= 100)

    def test_gemini_fallback_without_key(self):
        """Verifies generate_project_idea falls back safely to mock data when API key is empty."""
        # This will trigger fallback since API key is not set/invalid in standard test environments
        raw_data = generate_project_idea(
            domain="Machine Learning",
            skills=["Scikit-Learn"],
            difficulty="Beginner",
            team_size=2,
            duration="3 Weeks"
        )
        
        # Validates Pydantic schema structure
        validated_project = ProjectIdea(**raw_data)
        self.assertIsNotNone(validated_project.title)
        self.assertIsNotNone(validated_project.problem_statement)
        self.assertTrue(len(validated_project.features) >= 2)
        self.assertTrue(len(validated_project.viva_questions.technical) >= 1)

if __name__ == "__main__":
    unittest.main()
