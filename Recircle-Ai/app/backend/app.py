from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import uuid
import atexit
from pyngrok import ngrok
import time
import os
import logging
import math
import sys
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.tokenize import sent_tokenize

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Ensure NLTK resources are ready for sentiment analysis
try:
    nltk.data.find('sentiment/vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon', quiet=True)

for resource in ['punkt', 'punkt_tab']:
    try:
        nltk.data.find(f'tokenizers/{resource}')
    except LookupError:
        nltk.download(resource, quiet=True)

sia = SentimentIntensityAnalyzer()


@app.before_request
def log_request_info():
    """Uniform request logging so mobile clients can debug easily."""
    logger.debug("Incoming %s %s", request.method, request.path)

# ENHANCED: GHG Protocol & ISO 14040 Compliant Emission Factors
EMISSION_FACTORS = {
    "Food": {
        "co2_factor": 1.8,
        "co2e_factor": 2.2,  # Includes methane from landfill
        "water_factor": 60,
        "waste_factor": 1.2,
        "social_multiplier": 60,
        "impact_weight": 1.2,
        "base_score_multiplier": 12,
        "ghg_scope": "Scope 3",
        "lca_boundary": "cradle-to-grave"
    },
    "Clothes": {
        "co2_factor": 2.5,
        "co2e_factor": 3.8,  # Higher due to methane conversion
        "water_factor": 35,
        "waste_factor": 1.0,
        "social_multiplier": 45,
        "impact_weight": 1.1,
        "base_score_multiplier": 10,
        "ghg_scope": "Scope 3",
        "lca_boundary": "cradle-to-grave"
    },
    "Electronics": {
        "co2_factor": 4.0,
        "co2e_factor": 5.2,
        "water_factor": 18,
        "waste_factor": 1.5,
        "social_multiplier": 80,
        "impact_weight": 1.5,
        "base_score_multiplier": 18,
        "ghg_scope": "Scope 3",
        "lca_boundary": "cradle-to-grave"
    },
    "Furniture": {
        "co2_factor": 3.0,
        "co2e_factor": 4.1,
        "water_factor": 25,
        "waste_factor": 1.3,
        "social_multiplier": 65,
        "impact_weight": 1.3,
        "base_score_multiplier": 14,
        "ghg_scope": "Scope 3",
        "lca_boundary": "cradle-to-grave"
    },
    "Books": {
        "co2_factor": 2.0,
        "co2e_factor": 2.7,
        "water_factor": 12,
        "waste_factor": 0.8,
        "social_multiplier": 35,
        "impact_weight": 1.0,
        "base_score_multiplier": 8,
        "ghg_scope": "Scope 3",
        "lca_boundary": "cradle-to-grave"
    }
}

# GHG Protocol Compliant Calculation
GHG_EMISSION_FACTORS = {
    "Clothes": {
        "production": 8.0,      # kg CO₂ per kg (avoided production)
        "landfill_methane": 0.08, # kg methane per kg (converts to 2kg CO₂e)
        "transportation": 0.25,
        "waste_processing": 0.15
    },
    "Electronics": {
        "production": 45.0,
        "landfill_methane": 0.05,
        "transportation": 0.25,
        "recycling_avoided": 2.5
    },
    "Food": {
        "production": 3.5,
        "landfill_methane": 0.18, # Higher methane from organic waste
        "transportation": 0.25,
        "composting_avoided": 0.3
    },
    "Furniture": {
        "production": 15.0,
        "landfill_methane": 0.06,
        "transportation": 0.25,
        "waste_processing": 0.15
    },
    "Books": {
        "production": 6.0,
        "landfill_methane": 0.04,
        "transportation": 0.25,
        "waste_processing": 0.15
    }
}

IMPACT_CONFIG = {
    "co2_weight": 0.35,
    "water_weight": 0.30,
    "waste_weight": 0.25,
    "social_weight": 0.10,
    "base_multiplier": 5,
    "max_score_per_kg": 50,
    "diminishing_returns": 0.8,
    "max_quantity_bonus": 50
}

# In-memory storage
impact_reports = []
csr_summary = {
    "total_co2_saved": 0,
    "total_co2e_saved": 0,  # NEW: CO₂ equivalent
    "total_water_saved": 0,
    "total_waste_diverted": 0,
    "total_social_value": 0,
    "total_impact_score": 0,
    "last_updated": datetime.now().strftime("%Y-%m-%d"),
    "impact_level": "Getting Started 🚀",
    "total_impacts": 0,
    "average_impact_score": 0,
    "performance_rating": "Developing 📈",
    "compliance_standards": ["GHG Protocol", "ISO 14040", "UNEP Circular Economy"]
}

# Seller trust / review engine storage
sellers = {
    "seller1": {
        "name": "Ravi Kumar",
        "trustScore": 85.5,
        "totalReviews": 1,
        "totalRating": 5,
        "averageRating": 5.0,
        "recommendedCount": 1,
        "recommendRate": 100,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    }
}

WEIGHTS = {
    "sentiment": 0.4,
    "rating": 0.3,
    "delivery": 0.2,
    "recommend": 0.1
}

DELIVERY_MAP = {
    "excellent": 100,
    "good": 80,
    "average": 60,
    "poor": 40,
    "bad": 20,
    "fast": 90,
    "slow": 30,
    "quick": 90,
    "delayed": 30,
    "ontime": 80,
    "great": 90,
    "awesome": 95,
    "perfect": 100,
    "terrible": 20,
    "horrible": 10
}

def calculate_ghg_compliant_impact(category, quantity_kg, distance_km=0):
    """GHG Protocol compliant impact calculation"""
    factors = GHG_EMISSION_FACTORS.get(category, {})
    
    # Avoided production emissions (CO₂)
    avoided_production = quantity_kg * factors.get('production', 0)
    
    # Avoided landfill methane (converted to CO₂e)
    methane_kg = quantity_kg * factors.get('landfill_methane', 0)
    avoided_methane_co2e = methane_kg * 25  # Methane is 25x CO₂
    
    # Other avoided emissions
    avoided_processing = quantity_kg * factors.get('waste_processing', 0)
    avoided_transport = distance_km * factors.get('transportation', 0)
    
    total_co2 = avoided_production + avoided_processing + avoided_transport
    total_co2e = total_co2 + avoided_methane_co2e
    
    return {
        'total_co2_saved_kg': round(total_co2, 2),
        'total_co2e_saved_kg': round(total_co2e, 2),  # CO₂ equivalent
        'ghg_breakdown': {
            'avoided_production': round(avoided_production, 2),
            'avoided_methane_co2e': round(avoided_methane_co2e, 2),
            'avoided_processing': round(avoided_processing, 2),
            'avoided_transport': round(avoided_transport, 2)
        },
        'compliance': 'GHG Protocol Scope 3',
        'carbon_footprint_reduction': round(total_co2e, 2)
    }

def calculate_impact_score(impact_data):
    """Calculate comprehensive impact score with standards compliance"""
    
    category = impact_data["category"]
    quantity = impact_data["quantity_kg"]
    factor = EMISSION_FACTORS[category]
    
    # Get individual impact values
    co2e_saved = impact_data["co2e_saved_kg"]  # Use CO₂e instead of CO₂
    water_saved = impact_data["water_saved_l"]
    waste_diverted = impact_data["waste_diverted_kg"]
    social_value = impact_data["social_value"]
    
    logger.info(f"📊 Calculating STANDARDS-COMPLIANT score for {quantity}kg of {category}")
    
    # Calculate base scores with CO₂e
    co2_score = min(co2e_saved * 8, 200)   # Using CO₂e for accurate carbon accounting
    water_score = min(water_saved * 0.15, 150)
    waste_score = min(waste_diverted * 12, 150)
    social_score = min(social_value * 0.15, 100)
    
    # Apply weights
    weighted_score = (
        co2_score * IMPACT_CONFIG["co2_weight"] +
        water_score * IMPACT_CONFIG["water_weight"] +
        waste_score * IMPACT_CONFIG["waste_weight"] +
        social_score * IMPACT_CONFIG["social_weight"]
    )
    
    # Apply category weight and base multiplier
    category_weight = factor["impact_weight"]
    final_score = weighted_score * category_weight * IMPACT_CONFIG["base_multiplier"]
    
    # Ensure reasonable minimum score
    if final_score < 15 and (co2e_saved > 0 or water_saved > 0 or waste_diverted > 0):
        final_score = max(15, final_score)
    
    # Diminishing returns quantity bonus
    quantity_bonus = min(quantity * 3, IMPACT_CONFIG["max_quantity_bonus"])
    if quantity > 5:
        quantity_bonus *= IMPACT_CONFIG["diminishing_returns"]
    if quantity > 10:
        quantity_bonus *= IMPACT_CONFIG["diminishing_returns"]
    
    final_score += quantity_bonus
    final_score = max(15, min(800, round(final_score)))
    
    logger.info(f"🎯 FINAL STANDARDS-COMPLIANT impact score: {final_score}")
    
    return final_score

def get_impact_level(score):
    """Get impact level based on score"""
    if score >= 600:
        return "Environmental Champion 🌟"
    elif score >= 450:
        return "Eco Warrior 🦸‍♂️"
    elif score >= 300:
        return "Green Guardian 🌿"
    elif score >= 200:
        return "Planet Protector 🌎"
    elif score >= 100:
        return "Eco Beginner 🌱"
    elif score >= 50:
        return "Eco Starter 🌿"
    else:
        return "Getting Started 🚀"

def get_performance_rating(score):
    """Get performance rating for CSR report"""
    if score >= 600:
        return "Exceptional 🌟"
    elif score >= 450:
        return "Excellent ⭐"
    elif score >= 300:
        return "Very Good 👍"
    elif score >= 200:
        return "Good ✅"
    else:
        return "Developing 📈"

def calculate_circular_economy_metrics(category, quantity_kg):
    """Calculate circular economy benefits based on UNEP principles"""
    circularity_factors = {
        'Clothes': {'material_reuse': 0.85, 'lifetime_extension': 2.5, 'value_retention': 0.70},
        'Electronics': {'material_reuse': 0.65, 'lifetime_extension': 3.0, 'value_retention': 0.60},
        'Furniture': {'material_reuse': 0.90, 'lifetime_extension': 5.0, 'value_retention': 0.75},
        'Food': {'material_reuse': 0.40, 'lifetime_extension': 0.5, 'value_retention': 0.30},
        'Books': {'material_reuse': 0.95, 'lifetime_extension': 10.0, 'value_retention': 0.80}
    }
    
    factors = circularity_factors.get(category, {})
    
    return {
        'material_circularity': round(quantity_kg * factors.get('material_reuse', 0), 2),
        'lifetime_extension_years': factors.get('lifetime_extension', 0),
        'value_retention_rate': factors.get('value_retention', 0),
        'circular_economy_principles': [
            "Design out waste and pollution",
            "Keep products and materials in use", 
            "Regenerate natural systems"
        ],
        'unep_alignment': "Circularity Gap Reporting Framework"
    }


def calculate_trust_score_paragraph(review_text):
    """Advanced sentence-level sentiment analysis for seller reviews"""
    if not review_text or not review_text.strip() or review_text.lower() == "no comment":
        return [], 50.0

    try:
        sentences = sent_tokenize(review_text)
        total_score = 0
        results = []

        for sentence in sentences:
            sentiment = sia.polarity_scores(sentence)
            compound = sentiment['compound']

            if compound >= 0.05:
                label = "Positive"
                trust_score = 80 + (compound * 20)
                weight = 1.0
            elif compound <= -0.05:
                label = "Negative"
                trust_score = max(0, 50 + (compound * 50))
                weight = 1.5
            else:
                label = "Neutral"
                trust_score = 50 + (compound * 10)
                weight = 0.7

            results.append({
                "sentence": sentence.strip(),
                "sentiment": label,
                "compound": round(compound, 3),
                "trust_score": round(trust_score, 2),
                "weight": weight
            })
            total_score += trust_score * weight

        total_weight = sum(r["weight"] for r in results)
        avg_trust_score = round(total_score / total_weight, 2) if total_weight > 0 else 50.0
        return results, avg_trust_score

    except Exception as exc:
        logger.error("Error in sentence analysis: %s", exc)
        return [], 50.0


def calculate_enhanced_trust_score(review_text, rating, delivery_experience, recommend):
    """Calculate composite trust score from sentiment, rating, delivery, and recommendation"""
    try:
        sentence_analysis, sentiment_score = calculate_trust_score_paragraph(review_text)

        try:
            rating = float(rating)
            rating_score = (max(1, min(5, rating)) / 5) * 100
        except Exception:
            rating_score = 50.0

        delivery_lower = str(delivery_experience).lower().strip()
        delivery_score = DELIVERY_MAP.get(delivery_lower, 60)

        recommend_lower = str(recommend).lower().strip()
        recommend_score = 100 if recommend_lower == "yes" else 40

        trust_score = (
            sentiment_score * WEIGHTS["sentiment"] +
            rating_score * WEIGHTS["rating"] +
            delivery_score * WEIGHTS["delivery"] +
            recommend_score * WEIGHTS["recommend"]
        )

        trust_score = max(0, min(100, trust_score))

        return {
            "final_score": round(trust_score, 2),
            "component_scores": {
                "sentiment": round(sentiment_score, 2),
                "rating": round(rating_score, 2),
                "delivery": delivery_score,
                "recommend": recommend_score
            },
            "sentence_analysis": sentence_analysis
        }

    except Exception as exc:
        logger.error("Error in trust calculation: %s", exc)
        return {"final_score": 50.0, "component_scores": {}, "sentence_analysis": []}


def update_seller_trust(seller_data, new_review_score, alpha=0.3):
    """EWMA update for seller trust score to avoid sharp swings"""
    old_score = seller_data.get("trustScore", 50.0)
    new_score = round(old_score * (1 - alpha) + new_review_score * alpha, 2)
    logger.info("Trust score updated: %s -> %s", old_score, new_score)
    return new_score

def calculate_impact(transaction_data):
    """Calculate environmental impact with standards compliance"""
    category = transaction_data['category']
    quantity = transaction_data['quantity_kg']
    distance_km = transaction_data.get('distance_km', 0)
    
    if category not in EMISSION_FACTORS:
        category = "Food"
    
    factor = EMISSION_FACTORS[category]
    
    # Calculate GHG Protocol compliant impacts
    ghg_impact = calculate_ghg_compliant_impact(category, quantity, distance_km)
    
    # Calculate other impacts
    water_saved = quantity * factor["water_factor"]
    waste_diverted = quantity * factor["waste_factor"]
    social_value = ghg_impact['total_co2e_saved_kg'] * factor["social_multiplier"]
    
    # Calculate circular economy metrics
    circular_metrics = calculate_circular_economy_metrics(category, quantity)
    
    impact_data = {
        "co2_saved_kg": ghg_impact['total_co2_saved_kg'],
        "co2e_saved_kg": ghg_impact['total_co2e_saved_kg'],  # NEW: CO₂ equivalent
        "water_saved_l": round(water_saved, 2),
        "waste_diverted_kg": round(waste_diverted, 2),
        "social_value": round(social_value, 2),
        "category": category,
        "quantity_kg": quantity,
        "carbon_footprint_reduction": ghg_impact['carbon_footprint_reduction'],
        "compliance_standards": {
            "ghg_protocol": ghg_impact,
            "circular_economy": circular_metrics,
            "iso_14040": {
                "lca_boundary": factor["lca_boundary"],
                "impact_categories": ["climate_change", "water_use", "resource_depletion"],
                "data_quality": "industry_average"
            }
        }
    }
    
    # Calculate impact score
    impact_score = calculate_impact_score(impact_data)
    impact_data["impact_score"] = impact_score
    impact_data["impact_level"] = get_impact_level(impact_score)
    
    logger.info(f"🎯 Final standards-compliant impact data: {impact_data}")
    
    return impact_data

def update_csr_summary(impact_data):
    """Update CSR summary with enhanced metrics"""
    global csr_summary
    
    try:
        csr_summary["total_co2_saved"] += impact_data["co2_saved_kg"]
        csr_summary["total_co2e_saved"] += impact_data["co2e_saved_kg"]  # NEW
        csr_summary["total_water_saved"] += impact_data["water_saved_l"]
        csr_summary["total_waste_diverted"] += impact_data["waste_diverted_kg"]
        csr_summary["total_social_value"] += impact_data["social_value"]
        csr_summary["total_impact_score"] += impact_data["impact_score"]
        csr_summary["total_impacts"] = len(impact_reports)
        csr_summary["last_updated"] = datetime.now().strftime("%Y-%m-%d")
        
        if csr_summary["total_impacts"] > 0:
            avg_score = csr_summary["total_impact_score"] / csr_summary["total_impacts"]
            csr_summary["impact_level"] = get_impact_level(avg_score)
            csr_summary["average_impact_score"] = round(avg_score, 2)
            csr_summary["performance_rating"] = get_performance_rating(avg_score)
        
        logger.info(f"✅ Enhanced CSR summary updated. Total CO₂e: {csr_summary['total_co2e_saved']}kg")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error updating CSR summary: {e}")
        return False

def update_impact_data(transaction_id, impact_data):
    """Store impact data in memory"""
    global impact_reports, csr_summary
    
    try:
        impact_data["calculated_at"] = datetime.now().isoformat()
        impact_data["transaction_id"] = transaction_id
        impact_data["created_at"] = datetime.now().isoformat()
        
        impact_reports.append(impact_data)
        update_csr_summary(impact_data)
        
        logger.info(f"✅ Impact data saved: {transaction_id} | Score: {impact_data['impact_score']}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to save impact data: {e}")
        return False

@app.route('/', methods=['GET'])
def root_status():
    """Unified health endpoint for both CSR analytics and trust engine"""
    return jsonify({
        "status": "healthy",
        "service": "Recircle unified impact & trust backend",
        "timestamp": datetime.now().isoformat(),
        "modules": {
            "impact": {
                "total_impacts": len(impact_reports),
                "total_co2e_saved": csr_summary["total_co2e_saved"],
                "average_score": csr_summary.get("average_impact_score", 0)
            },
            "trust": {
                "tracked_sellers": len(sellers),
                "sample_seller_trust": sellers.get("seller1", {}).get("trustScore", 0)
            }
        },
        "endpoints": {
            "csr": ["/calculate-impact", "/csr-summary", "/impact-reports", "/impact-analytics", "/standards-info"],
            "trust": ["/seller/<id>", "/seller/<id>/review", "/test/review", "/ping"]
        }
    })


@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "pong", "status": "ok"})


@app.route('/seller/<seller_id>', methods=['GET'])
def get_seller(seller_id):
    seller_data = sellers.get(seller_id)
    if seller_data:
        return jsonify({
            "id": seller_id,
            "name": seller_data.get("name", f"Seller {seller_id}"),
            "trustScore": seller_data.get("trustScore", 50.0),
            "totalReviews": seller_data.get("totalReviews", 0),
            "averageRating": seller_data.get("averageRating", 0.0),
            "recommendRate": seller_data.get("recommendRate", 0),
            "exists": True
        })
    return jsonify({
        "error": "Seller not found",
        "exists": False,
        "message": "Seller will be created when first review is submitted"
    }), 404


@app.route('/seller/<seller_id>/review', methods=['POST', 'OPTIONS'])
def add_review(seller_id):
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    try:
        data = request.get_json() or {}
        review_text = str(data.get("review", "")).strip()
        rating = data.get("rating", 5)
        delivery_source = data.get("delivery", data.get("deliveryExperience", "average"))
        delivery_experience = str(delivery_source or "average").strip()
        recommend = str(data.get("recommend", "Yes")).strip()
        from_name = str(data.get("from", "Anonymous")).strip()
        product = str(data.get("product", "Unknown")).strip()
        timestamp = data.get("timestamp", datetime.now().isoformat())

        if not review_text and data.get("allowEmptyReview", False) is False:
            logger.warning("Review text missing for seller %s", seller_id)

        if seller_id not in sellers:
            sellers[seller_id] = {
                "name": data.get("sellerName", f"Seller {seller_id}"),
                "trustScore": 50.0,
                "totalReviews": 0,
                "totalRating": 0,
                "averageRating": 0.0,
                "recommendedCount": 0,
                "recommendRate": 0,
                "createdAt": datetime.now().isoformat(),
                "updatedAt": datetime.now().isoformat()
            }

        enhanced_analysis = calculate_enhanced_trust_score(review_text, rating, delivery_experience, recommend)
        final_score = enhanced_analysis["final_score"]

        old_trust_score = sellers[seller_id]["trustScore"]
        sellers[seller_id]["trustScore"] = update_seller_trust(sellers[seller_id], final_score)

        sellers[seller_id]["totalReviews"] = sellers[seller_id].get("totalReviews", 0) + 1
        sellers[seller_id]["totalRating"] = sellers[seller_id].get("totalRating", 0) + float(rating)
        if recommend.lower() == "yes":
            sellers[seller_id]["recommendedCount"] = sellers[seller_id].get("recommendedCount", 0) + 1

        total_reviews = sellers[seller_id]["totalReviews"]
        total_rating = sellers[seller_id]["totalRating"]
        recommended_count = sellers[seller_id].get("recommendedCount", 0)

        sellers[seller_id]["averageRating"] = round(total_rating / total_reviews, 1)
        sellers[seller_id]["recommendRate"] = round((recommended_count / total_reviews) * 100) if total_reviews else 0
        sellers[seller_id]["updatedAt"] = datetime.now().isoformat()

        response_data = {
            "message": "Review submitted successfully!",
            "review": {
                "from": from_name,
                "product": product,
                "comment": review_text,
                "rating": str(rating),
                "deliveryExperience": delivery_experience,
                "recommend": recommend,
                "score": final_score,
                "timestamp": timestamp
            },
            "seller": {
                "id": seller_id,
                "name": sellers[seller_id]["name"],
                "trustScore": sellers[seller_id]["trustScore"],
                "totalReviews": total_reviews,
                "averageRating": sellers[seller_id]["averageRating"],
                "recommendRate": sellers[seller_id]["recommendRate"]
            },
            "trust_score_change": {
                "old": old_trust_score,
                "new": sellers[seller_id]["trustScore"],
                "difference": round(sellers[seller_id]["trustScore"] - old_trust_score, 2)
            },
            "analysis": enhanced_analysis,
            "firebase_ready": True,
            "backend_processed": True
        }

        return jsonify(response_data), 200

    except Exception as exc:
        logger.exception("Error processing review")
        return jsonify({
            "error": f"Failed to submit review: {exc}",
            "firebase_project": "sellerreviewapp1"
        }), 500


@app.route('/test/review', methods=['POST'])
def test_review():
    test_data = {
        "from": "Test User",
        "product": "Test Product",
        "review": "This is a great product with excellent quality!",
        "rating": 5,
        "deliveryExperience": "excellent",
        "recommend": "Yes"
    }

    try:
        enhanced_analysis = calculate_enhanced_trust_score(
            test_data["review"],
            test_data["rating"],
            test_data["deliveryExperience"],
            test_data["recommend"]
        )
        return jsonify({
            "test_result": "success",
            "trust_score": enhanced_analysis["final_score"],
            "analysis": enhanced_analysis,
            "message": "Backend AI system is working correctly!"
        })
    except Exception as exc:
        return jsonify({
            "test_result": "error",
            "error": str(exc)
        }), 500


@app.route('/calculate-impact', methods=['POST', 'OPTIONS'])
def calculate_impact_api():
    if request.method == 'OPTIONS':
        return '', 200
        
    start_time = time.time()
    
    try:
        data = request.get_json()
        logger.info(f"📥 Received impact calculation request: {data}")
        
        if not data or 'category' not in data or 'quantity_kg' not in data:
            return jsonify({
                "status": "error",
                "message": "Missing required fields: category and quantity_kg"
            }), 400
        
        quantity = float(data['quantity_kg'])
        if quantity <= 0:
            return jsonify({
                "status": "error",
                "message": "Quantity must be greater than 0"
            }), 400
        
        transaction_id = str(uuid.uuid4())
        
        # Calculate impact with standards compliance
        impact_data = calculate_impact(data)
        impact_data["transaction_id"] = transaction_id
        impact_data["created_at"] = datetime.now().isoformat()
        
        logger.info(f"📊 Final calculated impact: {impact_data}")
        
        storage_success = update_impact_data(transaction_id, impact_data)
        processing_time = round(time.time() - start_time, 2)
        
        if storage_success:
            return jsonify({
                "status": "success",
                "transaction_id": transaction_id,
                "impact": impact_data,
                "message": f"Impact calculated successfully! Score: {impact_data['impact_score']}",
                "processing_time": processing_time,
                "storage": "local_memory",
                "standards_compliant": True
            })
        else:
            return jsonify({
                "status": "partial_success",
                "transaction_id": transaction_id,
                "impact": impact_data,
                "message": f"Impact calculated but storage failed. Score: {impact_data['impact_score']}",
                "processing_time": processing_time,
                "storage": "calculation_only"
            })
        
    except Exception as e:
        processing_time = round(time.time() - start_time, 2)
        logger.error(f"❌ Error in calculate-impact: {e}")
        return jsonify({
            "status": "error",
            "message": f"Calculation error: {str(e)}",
            "processing_time": processing_time
        }), 500

@app.route('/csr-summary', methods=['GET'])
def get_csr_summary():
    try:
        # Ensure all required fields
        if "average_impact_score" not in csr_summary:
            csr_summary["average_impact_score"] = 0
        
        if "total_impacts" not in csr_summary:
            csr_summary["total_impacts"] = len(impact_reports)
        
        if "performance_rating" not in csr_summary:
            csr_summary["performance_rating"] = get_performance_rating(csr_summary["average_impact_score"])
        
        if "total_co2e_saved" not in csr_summary:
            csr_summary["total_co2e_saved"] = csr_summary["total_co2_saved"]
        
        logger.info(f"📋 Enhanced CSR Summary fetched: {csr_summary}")
        return jsonify({
            "status": "success", 
            "data": csr_summary,
            "storage": "local_memory",
            "standards": ["GHG Protocol", "ISO 14040", "UNEP Circular Economy"]
        })
    except Exception as e:
        logger.error(f"❌ Error fetching CSR summary: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/impact-reports', methods=['GET'])
def get_impact_reports():
    try:
        limit = request.args.get('limit', 50, type=int)
        reports = impact_reports[-limit:] if limit < len(impact_reports) else impact_reports
        reports.sort(key=lambda x: x.get('impact_score', 0), reverse=True)
        
        logger.info(f"📊 Fetched {len(reports)} impact reports")
        return jsonify({
            "status": "success", 
            "data": reports,
            "storage": "local_memory",
            "total_records": len(impact_reports)
        })
    except Exception as e:
        logger.error(f"❌ Error fetching impact reports: {e}")
        return jsonify({
            "status": "error",
            "message": str(e),
            "data": []
        }), 500

@app.route('/impact-analytics', methods=['GET'])
def get_impact_analytics():
    """Get enhanced impact analytics with standards compliance"""
    try:
        if not impact_reports:
            return jsonify({
                "status": "success",
                "data": {
                    "total_impacts": 0,
                    "average_score": 0,
                    "impact_level": "Getting Started 🚀",
                    "category_breakdown": {},
                    "score_distribution": {},
                    "compliance_standards": ["GHG Protocol", "ISO 14040", "UNEP Circular Economy"]
                }
            })
        
        # Enhanced category breakdown with CO₂e
        category_breakdown = {}
        for report in impact_reports:
            category = report["category"]
            if category not in category_breakdown:
                category_breakdown[category] = {
                    "count": 0,
                    "total_score": 0,
                    "total_co2": 0,
                    "total_co2e": 0,  # NEW
                    "total_water": 0,
                    "total_waste": 0
                }
            
            category_breakdown[category]["count"] += 1
            category_breakdown[category]["total_score"] += report["impact_score"]
            category_breakdown[category]["total_co2"] += report["co2_saved_kg"]
            category_breakdown[category]["total_co2e"] += report.get("co2e_saved_kg", report["co2_saved_kg"])
            category_breakdown[category]["total_water"] += report["water_saved_l"]
            category_breakdown[category]["total_waste"] += report["waste_diverted_kg"]
        
        # Calculate averages
        for category in category_breakdown:
            data = category_breakdown[category]
            data["average_score"] = round(data["total_score"] / data["count"], 2)
            data["average_co2"] = round(data["total_co2"] / data["count"], 2)
            data["average_co2e"] = round(data["total_co2e"] / data["count"], 2)  # NEW
            data["average_water"] = round(data["total_water"] / data["count"], 2)
            data["average_waste"] = round(data["total_waste"] / data["count"], 2)
        
        # Score distribution
        score_ranges = {
            "champion": 0,  # 600-800
            "warrior": 0,   # 450-599
            "guardian": 0,  # 300-449
            "protector": 0, # 200-299
            "beginner": 0,  # 100-199
            "starter": 0    # 0-99
        }
        
        for report in impact_reports:
            score = report["impact_score"]
            if score >= 600:
                score_ranges["champion"] += 1
            elif score >= 450:
                score_ranges["warrior"] += 1
            elif score >= 300:
                score_ranges["guardian"] += 1
            elif score >= 200:
                score_ranges["protector"] += 1
            elif score >= 100:
                score_ranges["beginner"] += 1
            else:
                score_ranges["starter"] += 1
        
        analytics_data = {
            "total_impacts": len(impact_reports),
            "average_score": round(csr_summary["total_impact_score"] / len(impact_reports), 2),
            "impact_level": csr_summary["impact_level"],
            "category_breakdown": category_breakdown,
            "score_distribution": score_ranges,
            "total_co2_saved": csr_summary["total_co2_saved"],
            "total_co2e_saved": csr_summary["total_co2e_saved"],  # NEW
            "total_water_saved": csr_summary["total_water_saved"],
            "total_waste_diverted": csr_summary["total_waste_diverted"],
            "total_social_value": csr_summary["total_social_value"],
            "compliance_standards": ["GHG Protocol", "ISO 14040", "UNEP Circular Economy"],
            "carbon_accounting": "CO₂e (Carbon Dioxide Equivalent) - Includes all greenhouse gases"
        }
        
        return jsonify({
            "status": "success",
            "data": analytics_data
        })
        
    except Exception as e:
        logger.error(f"❌ Error fetching analytics: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/standards-info', methods=['GET'])
def get_standards_info():
    """Get information about compliance standards"""
    return jsonify({
        "status": "success",
        "standards": {
            "ghg_protocol": {
                "name": "Greenhouse Gas Protocol",
                "purpose": "Standardized greenhouse gas accounting",
                "implementation": "Scope 3 avoided emissions calculation",
                "metrics": ["CO₂", "CO₂e", "Carbon Footprint"]
            },
            "iso_14040": {
                "name": "ISO 14040 Life Cycle Assessment",
                "purpose": "Environmental impact assessment throughout product lifecycle", 
                "implementation": "Simplified LCA with cradle-to-grave boundary",
                "metrics": ["Global Warming Potential", "Water Use", "Resource Depletion"]
            },
            "circular_economy": {
                "name": "UNEP Circular Economy Principles", 
                "purpose": "Transition from linear to circular economic models",
                "implementation": "Material circularity and waste prevention metrics",
                "principles": [
                    "Design out waste and pollution",
                    "Keep products and materials in use",
                    "Regenerate natural systems"
                ]
            }
        }
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "Recircle unified backend",
        "timestamp": datetime.now().isoformat(),
        "version": "5.0.0",
        "storage": "local_memory",
        "impact_records": len(impact_reports),
        "total_impact_score": csr_summary["total_impact_score"],
        "compliance_standards": ["GHG Protocol", "ISO 14040", "UNEP Circular Economy"],
        "carbon_accounting": "CO₂e (Includes all greenhouse gases)",
        "features": [
            "ghg_protocol_compliant",
            "iso_14040_lca", 
            "circular_economy_metrics",
            "co2e_calculation",
            "enhanced_csr_reporting",
            "seller_trust_scoring",
            "nltk_sentiment_engine"
        ],
        "trust_module": {
            "tracked_sellers": len(sellers),
            "sample_trust_score": sellers.get("seller1", {}).get("trustScore", 0)
        }
    })

# Existing endpoints remain the same...
@app.route('/test-impact', methods=['GET'])
def test_impact_calculation():
    """Test impact calculation with sample data"""
    test_samples = [
        {"category": "Food", "quantity_kg": 1},
        {"category": "Electronics", "quantity_kg": 1},
        {"category": "Clothes", "quantity_kg": 2},
        {"category": "Furniture", "quantity_kg": 5},
        {"category": "Books", "quantity_kg": 3}
    ]
    
    results = []
    for sample in test_samples:
        impact_data = calculate_impact(sample)
        results.append({
            "sample": sample,
            "result": impact_data
        })
    
    return jsonify({
        "status": "success",
        "test_results": results,
        "carbon_accounting_note": "Using CO₂e (Carbon Dioxide Equivalent) for accurate climate impact"
    })

@app.route('/reset-data', methods=['POST'])
def reset_data():
    """Reset all data"""
    global impact_reports, csr_summary
    impact_reports = []
    csr_summary = {
        "total_co2_saved": 0,
        "total_co2e_saved": 0,
        "total_water_saved": 0,
        "total_waste_diverted": 0,
        "total_social_value": 0,
        "total_impact_score": 0,
        "last_updated": datetime.now().strftime("%Y-%m-%d"),
        "impact_level": "Getting Started 🚀",
        "total_impacts": 0,
        "average_impact_score": 0,
        "performance_rating": "Developing 📈",
        "compliance_standards": ["GHG Protocol", "ISO 14040", "UNEP Circular Economy"]
    }
    return jsonify({
        "status": "success",
        "message": "All data reset successfully"
    })

def setup_ngrok():
    """Setup ngrok tunnel"""
    try:
        ngrok.set_auth_token("33OsHeqH8e4mh8586xKsMXOppWA_42E2C5a6KhToQ88wKVkGU")
        public_url = ngrok.connect(5000, bind_tls=True)
        logger.info(f"✅ Ngrok tunnel created: {public_url}")
        atexit.register(lambda: ngrok.disconnect(public_url.public_url))
        return public_url
    except Exception as e:
        logger.error(f"❌ Ngrok setup failed: {e}")
        return None

if __name__ == '__main__':
    ngrok_tunnel = setup_ngrok()
    
    print("🚀 Starting Recircle Unified Backend (Impact + Trust)")
    print("🔧 Port: 5000")
    print("💾 Storage: Local Memory")
    print("⭐ CSR Features: GHG Protocol + ISO 14040 + Circular Economy")
    print("🤖 Trust Engine: NLTK VADER sentiment + delivery heuristics")
    print("🌍 Carbon Accounting: CO₂e (Includes all greenhouse gases)")
    print("🔬 Compliance: International Standards")
    print("🔗 Access URLs:")
    print("   - Local: http://localhost:5000")
    print("   - Android: http://10.0.2.2:5000") 
    if ngrok_tunnel:
        print(f"   - Ngrok: {ngrok_tunnel.public_url}")
    print("==================================================")
    print("✅ Server ready for CSR dashboards and ReviewSystem UI!")
    
    # Test enhanced scoring
    print("🧪 Testing ENHANCED impact scoring with standards...")
    test_samples = [
        {"category": "Clothes", "quantity_kg": 2},
        {"category": "Electronics", "quantity_kg": 1},
        {"category": "Food", "quantity_kg": 1}
    ]
    
    for sample in test_samples:
        result = calculate_impact(sample)
        co2e = result.get('co2e_saved_kg', result['co2_saved_kg'])
        print(f"   {sample['quantity_kg']}kg {sample['category']}: {result['impact_score']} pts | CO₂e: {co2e}kg")
    
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)